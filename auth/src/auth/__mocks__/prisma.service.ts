const user = {
  name: 'vfcd',
  email: 'fddfdd',
  password: 'dfdfd',
  createAt: new Date('12-12-2012'),
  id: '12343434324',
  age: 23,
  bio: null,
  profileURL: null,
  updatedAt: new Date('12-12-2012'),
};

export const mockPrismaService = jest.fn().mockReturnValue({
  user: {
    create: jest.fn().mockResolvedValue(user),
    findUnique: jest.fn().mockResolvedValue(user),
  },
});
