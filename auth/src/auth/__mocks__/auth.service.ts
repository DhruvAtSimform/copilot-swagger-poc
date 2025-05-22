export const AuthService = jest.fn().mockReturnValue({
  signin: jest
    .fn()
    .mockResolvedValue({ access_token: 'bla bla bla shake boom boom' }),
  createUser: jest
    .fn()
    .mockResolvedValue({ access_token: 'bla bla bla shake boom boom' }),
  signInToken: jest
    .fn()
    .mockResolvedValue({ access_token: 'bla bla bla shake boom boom' }),
});
