import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ju-animesociety-ecommerce-next" });

// Inngest function to save our user data from clerk from database

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url, phone_numbers} = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            phoneNo: phone_numbers[0].phone_number,
            imageUrl: image_url
        };

        await connectDB();
        await User.create(userData);
    }
)

// Inngest function to save our user data from clerk from database

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async({event}) => {
        const { id, first_name, last_name, email_addresses, image_url, phone_numbers} = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            phoneNo: phone_numbers[0].phone_number,
            imageUrl: image_url
        };

        await connectDB();
        await User.findByIdAndUpdate(id,userData);
    }
)

// Inngest function to detete user from database

export const syncUserDeletion= inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({event})=>{
        const {id} = event.data;

        await connectDB();
        await User.findByIdAndDelete(id);
    }
);