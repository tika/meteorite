import { createEndpoint } from '@app/endpoint';
import { NotFound } from '../../../../app/exceptions';

// GET (a list of people that follow this user), { userId } => [{ user1, user2 }]

export default createEndpoint({
  GET: async (req, res) => {
    const user = await prisma.user.findFirst({ where: { id: req.query.id as string }, include: { followers: true } });

    if (!user) {
      throw new NotFound("user");
    }

    const followers = user.followers.map((u) => {
      const { email, password, ...rest } = u;
      return rest;
    });

    res.json({ followers });
  }
})