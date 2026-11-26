import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { publicProductFilter } from "@/lib/productWizard";

export async function POST(request){
  const auth=await getCustomerSession();
  if(!auth)return NextResponse.json({error:"Please login before checkout"},{status:401});
  const body=await request.json();
  const {address,payment,lines,coupon}=body;
  if(!address?.phone||!address?.address||!lines?.length)return NextResponse.json({error:"Invalid order details"},{status:400});
  const products=await db.product.findMany({where:{...publicProductFilter,id:{in:lines.map(line=>line.product?.id).filter(Boolean)}}});
  const byId=new Map(products.map(product=>[product.id,product]));
  const validLines=lines.map(line=>({product:byId.get(line.product?.id),quantity:Math.max(1,Number(line.qty)||1)})).filter(line=>line.product);
  if(!validLines.length)return NextResponse.json({error:"No available products in this order"},{status:400});
  const subtotal=validLines.reduce((sum,line)=>sum+Number(line.product.price)*line.quantity,0);
  const [settings,couponRow]=await Promise.all([db.storeSetting.findMany(),coupon?db.coupon.findFirst({where:{code:String(coupon).toUpperCase(),active:true}}):null]);
  const config=Object.fromEntries(settings.map(row=>[row.key,Number(row.value)]));
  const freeDeliveryAbove=config.FREE_DELIVERY_ABOVE??499,deliveryFee=subtotal===0||subtotal>=freeDeliveryAbove?0:(config.DELIVERY_FEE??49);
  const discount=couponRow&&subtotal>=Number(couponRow.minOrderValue)?(couponRow.type==="PERCENT"?Math.round(subtotal*Number(couponRow.value)/100):Math.min(subtotal,Number(couponRow.value))):0;
  const order=await db.order.create({data:{orderNumber:`DW-${Date.now()}`,customerId:auth.user.id,status:"PENDING",subtotal,discount,deliveryFee,total:subtotal-discount+deliveryFee,paymentMethod:String(payment||"cod").toUpperCase(),deliveryName:address.name,deliveryPhone:address.phone,deliveryAddress:address.address,deliveryCity:address.city,deliveryPin:address.pin,items:{create:validLines.map(line=>({productId:line.product.id,name:line.product.name,quantity:line.quantity,unitPrice:Number(line.product.price)}))}},include:{items:true}});
  return NextResponse.json(order);
}
