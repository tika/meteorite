import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";

// GET (a list of people this user is following), { userId } => [{ user1, user2 }]

export default createEndpoint({
  GET: async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.query.id as string }, include: { followerOf: true } });

    if (!user) {
      throw new NotFound("user");
    }

    const following = user.followerOf.map((u) => {
      const { email, password, ...rest } = u;
      return rest;
    });

    res.json({ following });
  }
});
