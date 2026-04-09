import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  instagram: z
    .string()
    .url()
    .refine((url) => url.includes("instagram.com"), {
      message: "Coloque a url do instagram",
    })
    .optional(),
});

validacao();
function validacao() {
  const user = {
    name: "Toshyro",
    instagram: "https://www.instgram.com/kaique.pereira/",
  };

  const { error, success } = userSchema.safeParse(user);
  if (error) {
    console.log(error.message);
    return
  } else {
    console.log(success);
  }

  if (user.name === "Toshyro") {
    console.log("aaaa");
  }
}
