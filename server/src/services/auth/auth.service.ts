import bcrypt from "bcrypt";
import prisma from "../../config/database";
import { generateAccessToken } from "../../utils/jwt";
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
} from "../../validators/auth.validator";

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      currency: true,
      createdAt: true,
    },
  });

  const token = generateAccessToken(user.id);

  return {
    user,
    token,
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateAccessToken(user.id);

  const { passwordHash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.currency !== undefined && { currency: data.currency }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photoUrl: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};