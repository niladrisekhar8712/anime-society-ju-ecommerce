/*import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import User from "@/models/User"; 
import { inngest } from "@/config/inngest";

export async function POST(request){
    try{
        const{userId} = getAuth(request)
        const {address,items} = await request.json();
        if(!address||items.length===0)
        {
            return NextResponse.json({success:false,message:'Invalid data'});
        }
        const amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return await acc + product.offerPrice * item.quantity;
        },0)
        await inngest.send({
            name :'order/created',
            data:{
                userId,
                address,
                items,
                amount: amount + Math.floor(amount*0.02),
                date: Date.now()
            }
        })
        const user = await User.findById(userId)
        user.cartItems={}
        await user.save()

        return NextResponse.json({ success: true, message: 'Order Placed' })
    }catch(error){
        console.log(error);
        return NextResponse.json({ success: false, message: error.message })
    }
}*/

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order"; // Import the Order model
import connectDB from "@/config/db"; // Import connectDB
import { inngest } from "@/config/inngest";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        // Calculate the total amount
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return await acc + product.offerPrice * item.quantity;
        }, 0);

        // Connect to the database
        await connectDB();

        // Create the order
        const order = new Order({
            userId,
            address,
            items,
            amount: amount + Math.floor(amount * 0.02),
            date: Date.now()
        });

        // Save the order to the database
        await order.save();

        // Clear the user's cart
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        // Trigger Inngest event
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        });

        return NextResponse.json({ success: true, message: 'Order Placed' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}