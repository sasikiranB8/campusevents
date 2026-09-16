// backend/controllers/eventController.js (Corrected & Final)
const Event = require('../models/Event');
const { Op, Sequelize } = require('sequelize');

// GET All Events (with filtering including 'paid')
exports.getEvents = async (req, res) => {
  try {
    const { category, mode, /* type, */ search, featured, paid, limit } = req.query; // Removed type from filters for now
    const whereClause = {};

    if (category && category !== 'All Categories') whereClause.category = category;
    if (mode && mode !== 'All Modes') whereClause.mode = mode;
    // if (type && type !== 'All Types') whereClause.type = type; // Add back if using type filter
    if (featured === 'true') whereClause.isFeatured = true;

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (paid === 'true') { whereClause.registrationFee = { [Op.gt]: 0 }; }
    else if (paid === 'false') { whereClause.registrationFee = { [Op.or]: [{ [Op.lte]: 0 }, { [Op.is]: null }] }; }

    const queryOptions = {
        where: whereClause,
        order: [['date', 'DESC'], ['createdAt', 'DESC']],
    };

    // Add limit if provided (for recent events)
    if (limit && !isNaN(parseInt(limit))) {
        queryOptions.limit = parseInt(limit);
    }

    const events = await Event.findAll(queryOptions);

    const eventsWithUnderscoreId = events.map(event => {
        const plainEvent = event.get({ plain: true });
        plainEvent._id = plainEvent.id;
        return plainEvent;
     });

    res.json(eventsWithUnderscoreId);

  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: 'Server Error fetching events' });
  }
};

// GET Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const plainEvent = event.get({ plain: true });
    plainEvent._id = plainEvent.id;
    res.json(plainEvent);
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    res.status(500).json({ message: 'Server Error fetching event' });
  }
};

// POST Create Event
exports.createEvent = async (req, res) => {
  console.log("--- Create Event Request RECEIVED ---");
  console.log("User:", req.user ? `ID: ${req.user.id}, User: ${req.user.username}`: 'No User (Protect likely missing)');
  console.log("Body Received:", req.body);

  // Destructure ALL expected fields from body
  const {
    title, description, date, time, location, // Note: location might be null here if mode=Online
    category, mode, type, // Keep 'type' here as model requires it
    organizer, imageUrl, registrationLink, details, isFeatured,
    registrationFee
  } = req.body;

   const createdById = req.user ? req.user.id : null;
   if (!createdById) {
       console.error("ERROR: User ID missing in createEvent. 'protect' middleware issue?");
       return res.status(401).json({ message: 'Not authorized' });
   }

    // Basic backend validation (complementary to frontend)
    if (!title || !description || !date || !mode || !category || !type || !organizer) {
        console.error("ERROR: Backend validation failed - Missing required fields.");
        return res.status(400).json({ message: 'Missing required fields detected by server.' });
    }
    if (mode === 'Offline' && !location) {
         console.error("ERROR: Backend validation failed - Location required for Offline mode.");
        return res.status(400).json({ message: 'Location required for Offline mode.' });
    }

   // Prepare data for creation
   const eventDataToCreate = {
        title,
        description,
        date,
        time: time || null,
        // Use the location passed from body, which frontend should have set to null if mode=Online
        location: location, // Directly use the value from body (already validated by frontend check)
        category,
        mode,
        type, // Pass 'type' as received
        organizer,
        imageUrl: imageUrl || '/img/placeholder.jpg',
        registrationLink: registrationLink || null,
        details: details || null,
        isFeatured: typeof isFeatured === 'boolean' ? isFeatured : false,
        registrationFee: registrationFee != null ? parseFloat(registrationFee) : 0.00,
        createdBy: createdById
   };
   console.log("Data Prepared for Event.create:", eventDataToCreate);


  try {
    // Attempt to create in DB
    const newEvent = await Event.create(eventDataToCreate);
    console.log("Event Created Successfully in DB:", newEvent.toJSON());

    // Respond with created event
    const plainEvent = newEvent.get({ plain: true });
    plainEvent._id = plainEvent.id; // Map ID for frontend
    res.status(201).json(plainEvent);

  } catch (error) {
      // Handle DB/Validation errors
      console.error("ERROR during Event.create:", error);
       if (error instanceof Sequelize.ValidationError) {
           const messages = error.errors.map(e => `${e.path}: ${e.message}`);
           return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` });
       }
      res.status(500).json({ message: 'Server Error creating event' });
  }
};

// PUT Update Event (Placeholder)
exports.updateEvent = async (req, res) => {
    res.status(501).json({ message: 'Update not implemented' });
};

// DELETE Event
exports.deleteEvent = async (req, res) => {
     // ... (Implementation from previous steps seems correct) ...
     const eventId = req.params.id;
     const userId = req.user ? req.user.id : null;

     try {
         const event = await Event.findByPk(eventId);
         if (!event) return res.status(404).json({ message: 'Event not found' });
         if (!userId || event.createdBy !== userId) {
              return res.status(403).json({ message: 'User not authorized to delete this event' });
         }
         await event.destroy();
         res.status(200).json({ message: 'Event deleted successfully' });
     } catch (error) {
         console.error('Delete Event Error:', error);
         res.status(500).json({ message: 'Server Error deleting event' });
     }
};