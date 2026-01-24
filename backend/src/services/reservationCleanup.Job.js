import Reservation from "../models/Reservation.model.js";
import Product from "../models/Product.model.js";

export const cleanupExpiredReservations = async () => {
  const now = new Date();

  const expiredReservations = await Reservation.find({
    status: "ACTIVE",
    expiresAt: { $lte: now },
  });

  for (const reservation of expiredReservations) {
    // Restore stock
    await Product.findByIdAndUpdate(reservation.product, {
      $inc: { quantity: reservation.quantity },
    });

    reservation.status = "EXPIRED";
    await reservation.save();
  }
};
