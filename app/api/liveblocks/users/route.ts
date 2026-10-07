
import { auth, clerkClient } from "@clerk/nextjs/server";


type UserInfo = Liveblocks["UserMeta"]["info"];

export async function POST( request: Request ) {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return new Response("Unauthorized", { status: 401 });
    }

    //input validation

    let userIds : unknown;
    try{
        ;({ userIds } = await request.json())
    } catch (error) {
        return new Response("Invalid request body", { status: 400 });
    }

    //checks if the liveblocks userIds is an array of strings
    if (!Array.isArray(userIds) || userIds.some((id) => typeof id !== "string")) {
        return new Response("Invalid userIds format", { status: 400 });
    }

    const ids = userIds as string[];

    if (ids.length === 0) {
        return Response.json([], { status: 200 });
    }

    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({
        userId: ids,
        organizationId: [orgId],
        limit: ids.length
    })

    //create a hashmap of users by their id for easy lookup
    const userById = new Map(users.map((user) => [user.id, user]));

    const resolved: (UserInfo | null)[] = ids.map((id) => {
        const user = userById.get(id);
        if (!user) {
            return null;
        }

        return {
            name: 
                user.firstName ??
                user.username ??
                user.primaryEmailAddress?.emailAddress ??
                "Anonymous",
            avatar: user.imageUrl,
        }
    })

    return Response.json(resolved);

}