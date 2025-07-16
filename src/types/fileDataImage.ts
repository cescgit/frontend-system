import { z } from "zod";

// * JWT data
const imageShema = z.object({
    name: z.string()
});
  export const jwtDataSchema = z.array(
    imageShema.pick({
      name: true      
    })
  )

export type NameImage = z.infer<typeof imageShema>;
export type NameImageData = Pick<NameImage, "name">;
