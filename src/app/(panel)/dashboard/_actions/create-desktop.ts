"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createDesktop(formData: FormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar Desktop"
    }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const newDesktop = await prisma.desktop.create({
      data: {
        userId: session.user?.id,
        title: formData.title,
      }
    });

    revalidatePath("/dashboard");
    return { newDesktop };
  } catch (error) {
    return {
      error: "Falha ao cadastrar Desktop"
    }
  }
}


// import { prisma } from "@/lib/prisma";
// import { sendEmail } from "@/lib/transporter";

// export async function inviteUserToDesktop(desktopId: string, userId: string) {
//   // 1️⃣ Criar convite
//   const invitation = await prisma.desktopInvitation.create({
//     data: { desktopId, userId },
//   });

//   // 2️⃣ Criar notificação
//   await prisma.notification.create({
//     data: {
//       userId,
//       type: "INVITE",
//       message: `Você foi convidado para o projeto "${desktopId}"`,
//       referenceId: invitation.id,
//     },
//   });

//   // 3️⃣ Enviar e-mail
//   const acceptLink = `https://seusite.com/signin?callbackUrl=/invitations/accept?invitationId=${invitation.id}`;
//   const emailBody = `
//     <p>Você foi convidado para o projeto.</p>
//     <p><a href="${acceptLink}">Clique aqui para aceitar o convite</a></p>
//   `;

//   await sendEmail({
//     to: (await prisma.user.findUnique({ where: { id: userId } }))?.email!,
//     subject: "Convite para projeto",
//     html: emailBody,
//   });

//   return invitation;
// }

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";

// export default async function handler(req, res) {
//   const session = await auth(req);
//   if (!session?.user?.id) return res.status(401).json({ error: "Não autenticado" });

//   const { invitationId, action } = req.body;

//   const invitation = await prisma.desktopInvitation.findUnique({ where: { id: invitationId } });
//   if (!invitation || invitation.userId !== session.user.id) {
//     return res.status(404).json({ error: "Convite não encontrado" });
//   }

//   if (action === "ACCEPT") {
//     await prisma.desktopMember.create({
//       data: { desktopId: invitation.desktopId, userId: session.user.id },
//     });
//     await prisma.desktopInvitation.update({ where: { id: invitationId }, data: { status: "ACCEPTED" } });
//   } else if (action === "REJECT") {
//     await prisma.desktopInvitation.update({ where: { id: invitationId }, data: { status: "REJECTED" } });
//   }

//   res.status(200).json({ success: true });
// }
