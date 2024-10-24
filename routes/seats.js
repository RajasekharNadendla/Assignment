const express = require('express');
const router = express.Router();
const Seat = require('../models/seat');

router.get('/', async (req, res) => {
    try {
        const seats = await Seat.find();
        res.json(seats); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/book', async (req, res) => {
    const { numSeats } = req.body;

    if (!numSeats || numSeats < 1 || numSeats > 7) {
        return res.status(400).json({ error: 'You can only book between 1 and 7 seats' });
    }

    try {
        const availableSeats = await Seat.find({ isBooked: false });

        if (availableSeats.length < numSeats) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        const bookedSeats = [];
        for (let rowStart = 1; rowStart <= 77; rowStart += 7) {
            const rowSeats = availableSeats.filter(s => s.seatNumber >= rowStart && s.seatNumber < rowStart + 7);
            if (rowSeats.length >= numSeats) {
                const seatsToBook = rowSeats.slice(0, numSeats);
                seatsToBook.forEach(s => bookedSeats.push(s.seatNumber));
                break;
            }
        }

        if (bookedSeats.length === 0) {
            for (let i = 0; i < numSeats; i++) {
                bookedSeats.push(availableSeats[i].seatNumber);
            }
        }

        await Seat.updateMany({ seatNumber: { $in: bookedSeats } }, { isBooked: true });

        const allSeats = await Seat.find();

        res.json({
            message: `Seats booked: ${bookedSeats.join(', ')}`,
            bookedSeats: bookedSeats,
            allSeats: allSeats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
