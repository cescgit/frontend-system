import { z } from "zod";

// * JWT data
const jwtShema = z.object({
    id: z.string()
});
  export const jwtDataSchema = z.array(
    jwtShema.pick({
      id: true      
    })
  )

export type JWT = z.infer<typeof jwtShema>;
export type JWTData = Pick<JWT, "id">;
