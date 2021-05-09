import { createEndpoint } from "@app/endpoint";
import { NotFound } from "@app/exceptions";
import { santiseMany } from '../../../../app/santise';

// GET (a list of people this user is following), { userId } => [{ user1, user2 }]

export default createEndpoint({
  GET: async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.query.id as string }, include: { followerOf: true } });

    if (!user) {
      throw new NotFound("user");
    }

    res.json({ following: santiseMany(user.followerOf) });
  }
});
