import {
  createResourceResolver,
  interpretParsed,
  LexError,
  ParameterError,
  ParseError,
  parseScript,
  RuntimeError,
  type Declaration,
  type Resource,
  type ResourceFunctionCallParameter,
  type TypeNode,
} from 'requestscript';

export interface PlaygroundExample {
  id: string;
  label: string;
  source: string;
  /** JSON for the `parameters` object, shown for contract scripts. */
  parameters?: string;
}

export const examples: PlaygroundExample[] = [
  {
    id: 'hello',
    label: 'Hello World!',
    source: `request HelloWorld {
    const name = "World"
    return "Hello \${name}!"
}
`,
  },
  {
    id: 'line-total',
    label: 'Line total',
    source: `contract shop.orders.LineTotal@2(item: object, taxRate: decimal(1, 4)) {
    // Price a single line item
    var subtotal: decimal = 0
    subtotal = subtotal + item.price * item.quantity
    const total = subtotal + subtotal * taxRate

    if (total > 100 && item.giftWrap != true) {
        return { total: total, note: "Free shipping" }
    }

    return {
        total: total,
        note: "Taxed at \${taxRate * 100}%",
    }
}
`,
    parameters: `{
  "item": { "price": 9.99, "quantity": 2 },
  "taxRate": 0.0825
}`,
  },
  {
    id: 'weather',
    label: 'Weather resource',
    source: `request CurrentTemperature {
    const weather: com.example.Weather

    // Try a city without a station, like "Atlantis"
    const temperature = weather.temperature(city: "Oslo")

    if (temperature.error != null) {
        return temperature.error.message
    }

    return "It is \${temperature.value}°C in Oslo"
}
`,
  },
  {
    id: 'grade',
    label: 'Grading',
    source: `contract school.Grade(score: int32, late: boolean) {
    if (score < 0 || score > 100) {
        return { error: "Score must be between 0 and 100" }
    }

    var grade = "C"
    if (score >= 90 && !late) {
        grade = "A"
    } else if (score >= 80) {
        grade = "B"
    }

    return { score: score, grade: grade, passed: score >= 50 }
}
`,
    parameters: `{
  "score": 93,
  "late": false
}`,
  },
  {
    id: 'decimals',
    label: 'Exact numbers',
    source: `request ExactNumbers {
    const sum = 0.1 + 0.2
    const big: int64 = 9223372036854775807

    return {
        sum: sum,
        exact: sum == 0.3,
        third: 1 / 3.0,
        truncated: 7 / 2,
        largest: big,
    }
}
`,
  },
  {
    id: 'inventory',
    label: 'Inventory check',
    source: `contract shop.inventory.CanFulfil(sku: string, quantity: int32) {
    const inventory: shop.Inventory

    const stock = inventory.stock(sku: sku)
    if (stock.error != null) {
        return { ok: false, reason: stock.error.message }
    }

    if (stock.value < quantity) {
        return { ok: false, reason: "Only \${stock.value} left" }
    }

    return { ok: true, remaining: stock.value - quantity }
}
`,
    parameters: `{
  "sku": "RS-MUG",
  "quantity": 3
}`,
  },
];

function arg(args: ResourceFunctionCallParameter[], name: string): unknown {
  return args.find((a) => a.name === name)?.value;
}

const temperatures: Record<string, number> = {
  Oslo: 4.5,
  Lisbon: 19.25,
  Tokyo: 16.8,
  Nairobi: 22.1,
  'São Paulo': 24.6,
  Reykjavik: -1.5,
};

const stock: Record<string, number> = {
  'RS-MUG': 12,
  'RS-SHIRT': 2,
  'RS-STICKER': 340,
};

/** Demo resources available to playground scripts, mirroring the examples in the docs. */
export const playgroundResources: Resource[] = [
  {
    metadata: {},
    path: 'com.example',
    name: 'Weather',
    functions: [
      {
        name: 'temperature',
        parameters: [{ name: 'city', type: 'string' }],
        returnType: 'decimal',
        exec: async (args) => {
          const city = arg(args, 'city') as string | null;
          if (city === null || !(city in temperatures)) throw new Error(`No weather station for "${city}"`);
          return temperatures[city];
        },
      },
    ],
  },
  {
    metadata: {},
    path: 'shop',
    name: 'Inventory',
    functions: [
      {
        name: 'stock',
        parameters: [{ name: 'sku', type: 'string' }],
        returnType: 'int32',
        exec: async (args) => {
          const sku = arg(args, 'sku') as string | null;
          if (sku === null || !(sku in stock)) throw new Error(`Unknown SKU "${sku}"`);
          return stock[sku];
        },
      },
    ],
  },
];

/** A human-readable summary of the demo resources, for the playground's sidebar. */
export const resourceSignatures = [
  'com.example.Weather.temperature(city: string): decimal',
  'shop.Inventory.stock(sku: string): int32',
];

export function formatType(type: TypeNode): string {
  switch (type.kind) {
    case 'list':
      return `[]${formatType(type.element)}`;
    case 'decimal':
      return type.intDigits !== undefined ? `decimal(${type.intDigits}, ${type.fracDigits ?? 0})` : 'decimal';
    default:
      return type.kind;
  }
}

export function describeDeclaration(declaration: Declaration): string {
  if (declaration.kind === 'request') return `request ${declaration.name}`;
  const path = [...declaration.path, declaration.name].join('.');
  const params = declaration.parameters.map((p) => `${p.name}: ${formatType(p.type)}`).join(', ');
  return `contract ${path}@${declaration.version}${params ? `(${params})` : ''}`;
}

/** The HTTP request line the reference server would use to run this script. */
export function httpRequestLine(declaration: Declaration | null): string {
  if (!declaration || declaration.kind === 'request') return 'POST /run';
  return `POST /run/${[...declaration.path, declaration.name].join('/')}@${declaration.version}`;
}

export interface RunOutcome {
  status: number;
  body: unknown;
  declaration: Declaration | null;
  durationMs: number;
}

/** Inspects the source without running it, so the UI can show contract parameters as the user types. */
export function inspect(source: string): Declaration | null {
  try {
    return parseScript(source).declaration;
  } catch {
    return null;
  }
}

function errorBody(type: string, message: string) {
  return { error: { type, message } };
}

/**
 * Runs a script in the browser with the real interpreter and shapes the
 * outcome like the reference HTTP server's response.
 */
export async function run(source: string, parametersJson: string): Promise<RunOutcome> {
  const started = performance.now();
  const done = (status: number, body: unknown, declaration: Declaration | null): RunOutcome => ({
    status,
    body,
    declaration,
    durationMs: performance.now() - started,
  });

  let declaration: Declaration | null = null;
  try {
    const script = parseScript(source);
    declaration = script.declaration;

    let parameters: Record<string, unknown> | undefined;
    if (declaration.kind === 'contract' && parametersJson.trim()) {
      try {
        const parsed: unknown = JSON.parse(parametersJson);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return done(400, errorBody('ParameterError', 'Parameters must be a JSON object'), declaration);
        }
        parameters = parsed as Record<string, unknown>;
      } catch (error) {
        return done(400, errorBody('ParameterError', `Invalid parameters JSON: ${(error as Error).message}`), declaration);
      }
    }

    const result = await interpretParsed(script, {
      resourceResolver: createResourceResolver(playgroundResources),
      parameters,
    });
    return done(200, { returnValue: result.returnValue }, declaration);
  } catch (error) {
    // Class names are mangled by minification, so error types are named explicitly.
    if (error instanceof LexError) return done(400, errorBody('LexError', error.message), declaration);
    if (error instanceof ParseError) return done(400, errorBody('ParseError', error.message), declaration);
    if (error instanceof ParameterError) return done(400, errorBody('ParameterError', error.message), declaration);
    if (error instanceof RuntimeError) return done(422, errorBody('RuntimeError', error.message), declaration);
    return done(500, errorBody('InternalError', error instanceof Error ? error.message : String(error)), declaration);
  }
}
