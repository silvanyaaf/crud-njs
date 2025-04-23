"use server";

import {z} from "zod";
import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ContactSchema = z.object({
    name: z.string().min(6),
    phone: z.string().min(11),
    });

export const saveContact = async (_: unknown, formData: FormData) => {
    const validatedFields = ContactSchema.safeParse (Object.fromEntries(formData.entries()));

    if(!validatedFields.success){
        return{
            Error: validatedFields.error.flatten().fieldErrors
        }
    }

    try {
        await prisma.contact.create({
            data: {
                name: validatedFields.data.name,
                phone: validatedFields.data.phone
            }
        })
    } catch {
        return {message: "failed to create contact"}
    }
    revalidatePath("/contact");
    redirect("/contact");
}

export const updateContact = async (id:string, _: unknown, formData: FormData) => {
    const validatedFields = ContactSchema.safeParse (
        Object.fromEntries(formData.entries()));

    if(!validatedFields.success){
        return{
            Error: validatedFields.error.flatten().fieldErrors
        }
    }

    try {
        await prisma.contact.update({
            data: {
                name: validatedFields.data.name,
                phone: validatedFields.data.phone
            },
            where: {id}
        })
    } catch {
        return {message: "failed to update contact"}
    }
    revalidatePath("/contact");
    redirect("/contact");
}

export const deleteContact = async (
    id:string
) => {

    try {
        await prisma.contact.delete({
            where: {id},
        });
    } catch {
        return {message: "failed to delete contact"};
    }
    revalidatePath("/contact");
}