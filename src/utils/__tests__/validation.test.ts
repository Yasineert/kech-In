import {
  isStrongPassword,
  isValidEmail,
  validateLogin,
  validateRegistration,
} from '../validation';

describe('isValidEmail', () => {
  it.each(['user@example.com', ' first.last@mail.co.ma ', 'a+b@x.io'])(
    'accepts %p',
    email => expect(isValidEmail(email)).toBe(true),
  );

  it.each(['', 'plain', 'no-at.com', 'a@b', 'a@b.c', 'a b@c.com'])(
    'rejects %p',
    email => expect(isValidEmail(email)).toBe(false),
  );
});

describe('isStrongPassword', () => {
  it('accepts a password with letters, digits and 8+ characters', () => {
    expect(isStrongPassword('stage2025')).toBe(true);
  });

  it.each(['short1', 'onlyletters', '12345678'])('rejects %p', pwd =>
    expect(isStrongPassword(pwd)).toBe(false),
  );
});

describe('validateLogin', () => {
  it('rejects empty fields', () => {
    expect(validateLogin('', '')).toEqual({
      valid: false,
      error: 'Veuillez remplir tous les champs.',
    });
  });

  it('rejects a malformed e-mail', () => {
    expect(validateLogin('user@', 'secret123').valid).toBe(false);
  });

  it('accepts valid credentials', () => {
    expect(validateLogin('user@example.com', 'secret123')).toEqual({valid: true});
  });
});

describe('validateRegistration', () => {
  const valid = {
    fullName: 'Yasmine Alaoui',
    email: 'yasmine@example.com',
    password: 'stage2025',
    confirmPassword: 'stage2025',
  };

  it('accepts a complete and consistent form', () => {
    expect(validateRegistration(valid)).toEqual({valid: true});
  });

  it('rejects a missing name', () => {
    expect(validateRegistration({...valid, fullName: '  '}).valid).toBe(false);
  });

  it('rejects a weak password', () => {
    const result = validateRegistration({
      ...valid,
      password: 'abc',
      confirmPassword: 'abc',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects mismatching passwords', () => {
    expect(
      validateRegistration({...valid, confirmPassword: 'stage2026'}),
    ).toEqual({valid: false, error: 'Les mots de passe ne correspondent pas.'});
  });
});
