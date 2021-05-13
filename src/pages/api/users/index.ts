import { createEndpoint } from "@app/endpoint";
import {
  deleteSchema,
  loginSchema,
  registerSchema,
  updateSchema,
} from "@schemas/users";
import { DisplayedError, MissingData, NotFound } from "@app/exceptions";
import bcrypt from "bcrypt";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { santiseUser } from "@app/santise";

export default createEndpoint({
  GET: async (req, res) => {
    const user = await prisma.user.findFirst({
      where: { id: req.query.id as string },
      include: { likedPosts: true },
    });

    if (!user) {
      throw new NotFound("user");
    }

    res.json(santiseUser(user));
  },
  PATCH: async (req, res) => {
    const user = JWT.parseRequest(req);
    const { username, email, newPassword, password } = updateSchema.parse(
      req.body
    );

    if (!user) throw new NotFound("user");

    const fullUser = await prisma.user.findFirst({ where: { id: user.id } });

    if (!bcrypt.compareSync(password, fullUser!.password as string))
      throw new DisplayedError(403, "Incorrect password for user");

    await prisma.user.update({
      where: { id: user.id },
      data: { username, email, password: newPassword },
    });

    const newUser = await prisma.user.findFirst({ where: { id: user.id } });

    res.json(santiseUser(newUser!));
  },
  POST: async (req, res) => {
    const { username, password } = loginSchema.parse(req.body);
    if (!username) throw new MissingData("an email or username");

    const user = await prisma.user.findFirst({ where: { username } });

    if (!user) throw new NotFound("User cannot be found with this username");

    if (!bcrypt.compareSync(password, user.password as string))
      throw new DisplayedError(400, "Passwords do not match");

    const { password: _, ...rest } = user;

    const jwt = new JWT(rest);
    const token = jwt.sign();

    res.setHeader("Set-Cookie", JWT.cookie(token));

    res.json({ token });
  },
  PUT: async (req, res) => {
    const { username, email, password } = registerSchema.parse(req.body);

    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: bcrypt.hashSync(password, 10),
        },
      });
    } catch (e) {
      throw new DisplayedError(
        409,
        "This user with these details already exists"
      );
    }

    const { password: _, ...rest } = newUser;

    const jwt = new JWT(rest);
    const token = jwt.sign();

    res.setHeader("Set-Cookie", JWT.cookie(token));

    res.json({ token });
  },
  DELETE: async (req, res) => {
    const user = JWT.parseRequest(req);
    const { password } = deleteSchema.parse(req.body);

    if (!user) throw new NotFound("user");

    const fullUser = await prisma.user.findFirst({ where: { id: user.id } });

    if (!bcrypt.compareSync(password, fullUser!.password as string))
      throw new DisplayedError(403, "Incorrect password for user");

    await prisma.user.delete({ where: { id: user.id } });

    res.setHeader("Set-Cookie", JWT.logoutCookie());

    res.json({ message: "Sucessfully logged out" });
  },
});
