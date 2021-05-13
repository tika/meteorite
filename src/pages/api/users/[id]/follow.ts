import { createEndpoint } from "@app/endpoint";
import { JWT } from "@app/jwt";
import { followSchema } from '../../../../schemas/users';
import { NotFound } from '../../../../app/exceptions';
import { santiseUser } from "@app/santise";

// [Auth] PUT, { user5 } => [{ user1, user2, ...user5 }]

export default createEndpoint({
  PUT: async (req, res) => {
    const me = JWT.parseRequest(req);

    if (!me) {
      throw new Error("Unknown User");
    }

    const { userId } = followSchema.parse(req.body);

    if (userId === me.id) {
      throw new Error("You cannot follow yourself!");
    }

    const realUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!realUser) {
      throw new NotFound("user to follow");
    }

    // We can ignore if they already follow this user
    await prisma.user.update({ where: { id: me.id }, data: { 
        followerOf: {
          connect: { id: userId }
        }
      }
    });
  
    const updatedMe = await prisma.user.findFirst({ where: { id: me.id }, include: { followerOf: true } });

    res.send({ following: updatedMe?.followerOf.map((u) => santiseUser(u)) });
  },
  DELETE: async (req, res) => {
    const me = JWT.parseRequest(req);

    if (!me) {
      throw new Error("Unknown User");
    }

    const { userId } = followSchema.parse(req.body);

    if (userId === me.id) {
      throw new Error("You cannot unfollow yourself!");
    }

    const realUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!realUser) {
      throw new NotFound("user to unfollow");
    }

    await prisma.user.update({ where: { id: me.id }, data: { 
      followerOf: {
        disconnect: { id: userId }
      }
    }});

    const updatedMe = await prisma.user.findFirst({ where: { id: me.id }, include: { followerOf: true } });

    res.send({ following: updatedMe?.followerOf.map((u) => santiseUser(u)) });
  }
})