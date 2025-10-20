import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const Hash = {
  /**
   * Hash a password using bcrypt
   */
  hashPassword: async (password: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error("Failed to hash password");
    }
  },

  /**
   * Compare a password with its hash
   */
  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error("Failed to compare password");
    }
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength: (
    password: string
  ): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
