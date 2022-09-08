import { registerActivitySchema } from '@/schemas';
import faker from '@faker-js/faker';

describe('registerActivitySchema', () => {
  const generateValidInput = () => ({
    id: +faker.random.numeric(2),
  });

  describe('when id is not valid', () => {
    it('should return error if id is not present', () => {
      const input = generateValidInput();
      delete input.id;

      const { error } = registerActivitySchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if id is a string', () => {
      const input = generateValidInput();

      const { error } = registerActivitySchema.validate({ ...input, id: faker.lorem.word() });

      expect(error).toBeDefined();
    });

    it('should return error if id is not an integer', () => {
      const input = generateValidInput();
      input.id = input.id / +faker.random.numeric(3);

      const { error } = registerActivitySchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if id is less than or equal to 0', () => {
      const input = generateValidInput();
      input.id = -input.id;

      const { error } = registerActivitySchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it('should return no error if input is valid', () => {
    const input = generateValidInput();

    const { error } = registerActivitySchema.validate(input);

    expect(error).toBeUndefined();
  });
});
