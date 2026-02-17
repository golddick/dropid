import { customAlphabet } from 'nanoid';

/**
 * Configuration options for ID generation
 */
export interface DropIdOptions {
  /**
   * Length of the random part of the ID
   * @default 12
   * @example 12 → ~200 years to 1% collision at 1,000 IDs/sec
   */
  length?: number;

  /**
   * Characters to use in the random part
   * @default '0123456789abcdefghijklmnopqrstuvwxyz'
   * @example '0123456789abcdef' for hex IDs
   */
  alphabet?: string;

  /**
   * Separator between ID parts
   * @default '_'
   * @example '-' for dash-separated IDs
   */
  separator?: string;
}

/**
 * Default options for ID generation
 */
const defaultOptions: Required<DropIdOptions> = {
  length: 12,
  alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
  separator: '_',
}; 

/**
 * Global options that can be configured via configure()
 */
let globalOptions: Required<DropIdOptions> = { ...defaultOptions };

/**
 * Configure global options for all subsequent dropid() calls
 * 
 * @param options - Partial options to merge with defaults
 * 
 * @example
 * ```typescript
 * configure({ length: 16 }); // Use longer IDs globally
 * configure({ separator: '-' }); // Use dashes instead of underscores
 * ```
 */
export function configure(options: DropIdOptions): void {
  globalOptions = { ...globalOptions, ...options };
}

/**
 * Reset global configuration to defaults
 * 
 * @example
 * ```typescript
 * configure({ length: 16 });
 * dropid('user'); // → user_1234567890abcdef
 * 
 * resetConfig();
 * dropid('user'); // → user_123456789abc (back to length 12)
 * ```
 */
export function resetConfig(): void {
  globalOptions = { ...defaultOptions };
}

/**
 * Get current global configuration
 * 
 * @returns Current global options
 * 
 * @example
 * ```typescript
 * const config = getConfig();
 * console.log(config.length); // 12
 * ```
 */
export function getConfig(): Readonly<Required<DropIdOptions>> {
  return { ...globalOptions };
}

/**
 * Generate a unique ID with optional prefix
 * 
 * @param modelName - The name of your model/table (e.g., 'user', 'post')
 * @param prefix - Optional prefix for multi-tenant or namespacing
 * @param options - Override global configuration for this call
 * @returns Generated unique ID string
 * 
 * @example
 * ```typescript
 * dropid('user')                    // → user_a3f2b9c1d4e5
 * dropid('post', 'blog')            // → blog_post_x7k9m2n4p1q8
 * dropid('order', 'shop', { length: 16 }) // → shop_order_k8j3m9n2l4p6q1r7
 * ```
 */
export function dropid(
  modelName: string,
  prefix?: string,
  options?: DropIdOptions
): string {
  // Validate model name
  if (!modelName || typeof modelName !== 'string') {
    throw new TypeError('modelName must be a non-empty string');
  }

  // Merge options (call options > global options > defaults)
  const opts: Required<DropIdOptions> = {
    ...globalOptions,
    ...options,
  };

  // Validate options
  if (opts.length < 1) {
    throw new RangeError('length must be at least 1');
  }

  if (!opts.alphabet || opts.alphabet.length < 2) {
    throw new TypeError('alphabet must contain at least 2 characters');
  }

  if (typeof opts.separator !== 'string') {
    throw new TypeError('separator must be a string');
  }

  // Generate random ID
  const generate = customAlphabet(opts.alphabet, opts.length);
  const id = generate();

  // Build ID parts
  const normalizedModelName = modelName.toLowerCase().trim();
  const parts = prefix
    ? [prefix, normalizedModelName, id]
    : [normalizedModelName, id];

  return parts.join(opts.separator);
}

/**
 * Create a reusable ID generator with a fixed prefix
 * Perfect for multi-tenant applications
 * 
 * @param prefix - The prefix to use for all generated IDs
 * @param options - Optional configuration for this generator
 * @returns A function that generates prefixed IDs
 * 
 * @example
 * ```typescript
 * const acmeId = createPrefixedId('acme');
 * acmeId('user'); // → acme_user_a3f2b9c1d4e5
 * acmeId('post'); // → acme_post_x7k9m2n4p1q8
 * 
 * // With custom options
 * const orgId = createPrefixedId('org', { length: 16 });
 * orgId('workspace'); // → org_workspace_k8j3m9n2l4p6q1r7
 * ```
 */
export function createPrefixedId(
  prefix: string,
  options?: DropIdOptions
): (modelName: string) => string {
  // Validate prefix
  if (!prefix || typeof prefix !== 'string') {
    throw new TypeError('prefix must be a non-empty string');
  }

  return (modelName: string): string => {
    return dropid(modelName, prefix, options);
  };
}

/**
 * Common alphabet presets for convenience
 */
export const alphabets = {
  /**
   * Alphanumeric lowercase (default)
   * No confusing characters
   */
  alphanumeric: '0123456789abcdefghijklmnopqrstuvwxyz',

  /**
   * Base58 - No confusing characters (0/O, 1/l/I)
   * Bitcoin/IPFS style
   */
  base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',

  /**
   * Hexadecimal
   */
  hex: '0123456789abcdef',

  /**
   * URL-safe Base64
   */
  base64url: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_',

  /**
   * Numbers only (not recommended - higher collision risk)
   */
  numeric: '0123456789',
} as const;

/**
 * Common length presets based on collision risk
 */
export const lengths = {
  /**
   * Short (8 chars) - Use for temporary/non-critical IDs
   * ~4 years to 1% collision at 1,000 IDs/sec
   */
  short: 8,

  /**
   * Medium (12 chars) - Default, good balance
   * ~200 years to 1% collision at 1,000 IDs/sec
   */
  medium: 12,

  /**
   * Long (16 chars) - Extra safety
   * ~10^12 years to 1% collision at 1,000 IDs/sec
   */
  long: 16,

  /**
   * Extra long (21 chars) - nanoid default, maximum safety
   * Essentially collision-proof in any practical scenario
   */
  extraLong: 21,
} as const;
