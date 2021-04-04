import { createEndpoint } from "../../app/endpoint";
import {
  deleteSchema,
  loginSchema,
  registerSchema,
  updateSchema,
} from "../../schemas/users";
import {
  DisplayedError,
  MissingData,
  NotFound,
  Unauthenticated,
} from "../../app/exceptions";
import bcrypt from "bcrypt";
import { JWT } from "../../app/jwt";
import { prisma } from "../../app/prisma";

export default createEndpoint({
  GET: async (req, res) => {
    const user = await prisma.user.findFirst({
      where: { id: req.query.id as string },
    });

    if (!user) {
      throw new NotFound("user");
    }

    const { password, email, ...rest } = user;

    res.json(rest);
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

    res.status(200);
  },
  POST: async (req, res) => {
    const { username, email, password } = loginSchema.parse(req.body);
    if (!username && !email) throw new MissingData("an email or username");

    const user = await prisma.user.findFirst({ where: { username, email } });

    if (!user)
      throw new NotFound("User cannot be found with this username or email");

    if (!bcrypt.compareSync(password, user.password as string))
      throw new DisplayedError(400, "Passwords do not match");

    const { password: _, ...rest } = user;

    const jwt = new JWT(rest);
    const token = jwt.sign();

    res.setHeader("Set-Cookie", JWT.cookie(token));

    res.json(token);
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

    res.json(token);
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
