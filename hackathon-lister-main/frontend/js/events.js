// --- START OF FILE frontend/js/events.js ---

// --- Element Selection (Cached at top level for performance) ---
const eventsGrid = document.getElementById('events-grid'); // May not be used if only list/detail view exists on events.html
const eventListContainer = document.getElementById('event-list-container');
const eventDetailPanel = document.getElementById('event-detail-panel');
const eventDetailsContent = document.getElementById('event-details-content'); // For standalone event-details.html page
const organizeForm = document.getElementById('organize-form');
// Filters (ensure these IDs match events.html)
const filterButton = document.getElementById('filter-button');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('filter-category');
const modeFilter = document.getElementById('filter-mode');
const feeFilter = document.getElementById('filter-fee');
// Carousels/Containers
const featuredEventsContainer = document.getElementById('featured-events-container'); // For index.html
const recentEventsCarouselWrapper = document.getElementById('recent-events-carousel'); // Wrapper div for slides on events.html
let recentEventsSwiper = null; // Variable to hold the Swiper instance

// --- Display Functions ---

/**
 * Displays events in a vertical list format (left column on events.html).
 * @param {Array} events - Array of event objects.
 * @param {HTMLElement} containerElement - The DOM element to append list items to.
 */
function displayEventList(events, containerElement) {
    if (!containerElement) {
        console.error("displayEventList: containerElement is missing.");
        return;
    }
    containerElement.innerHTML = ''; // Clear previous content or loading message

    if (!events || !Array.isArray(events) || events.length === 0) {
        containerElement.innerHTML = '<p>No events found matching your criteria.</p>';
        // Clear detail panel when the list is empty
        if (eventDetailPanel) {
            eventDetailPanel.innerHTML = '<p>Select an event from the list to view details.</p>';
            eventDetailPanel.classList.add('placeholder'); // Add placeholder style
        }
        return;
    }

    console.log(` -> displayEventList: Rendering ${events.length} events.`);
    events.forEach((event, index) => {
        if (!event || typeof event !== 'object' || !event._id) {
            console.warn(` -> displayEventList: Skipping event at index ${index} due to missing ID or invalid structure.`);
            return; // Skip if essential data missing
        }

        const listItem = document.createElement('div');
        listItem.classList.add('event-list-item');
        listItem.setAttribute('data-event-id', event._id); // Store ID for easy access

        const eventDate = event.date ? new Date(event.date) : null;
        const formattedDate = eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';

        listItem.innerHTML = `
            <img src="${event.imageUrl || 'images/default-event.jpg'}" alt="${event.title || 'Event'} thumbnail">
            <div class="event-list-item-content">
                 <h4>${event.title || 'Untitled Event'}</h4>
                 <p>📅 ${formattedDate} | ${event.mode || 'N/A'} | ${event.category || 'N/A'}</p>
                 <!-- Optionally add Fee indicator: ${event.registrationFee > 0 ? '$' : 'Free'} -->
             </div>
        `;

        // Add click listener to load details in the right panel
        listItem.addEventListener('click', () => {
            console.log(`🖱️ List item clicked: Event ID ${event._id}`);
            // Highlight clicked item
            const currentlySelected = containerElement.querySelector('.event-list-item.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }
            listItem.classList.add('selected');
            // Load details
            loadAndDisplayEventDetail(event._id, eventDetailPanel);
        });

        containerElement.appendChild(listItem);

        // Automatically load the first event's details when the list first loads
        if (index === 0 && eventDetailPanel && eventDetailPanel.classList.contains('placeholder')) {
            console.log(`   -> Automatically loading details for first event: ${event.title}`);
             listItem.classList.add('selected'); // Mark first item as selected
             loadAndDisplayEventDetail(event._id, eventDetailPanel);
        }
    });
}

/**
 * Displays the full details of a single event in the right panel on events.html.
 * @param {object} event - The full event object.
 * @param {HTMLElement} panelElement - The DOM element for the detail panel.
 */
function displayEventDetailPanel(event, panelElement) {
    if (!panelElement) { console.error("displayEventDetailPanel: panelElement is missing."); return; }
    if (!event || typeof event !== 'object') {
        console.error("displayEventDetailPanel: Invalid event data provided.");
        panelElement.innerHTML = '<p class="error">Could not display event details (invalid data).</p>';
        panelElement.classList.add('placeholder');
        return;
     }

    console.log(` -> displayEventDetailPanel: Rendering details for ${event.title}`);
    panelElement.classList.remove('placeholder'); // Remove placeholder class

    // --- Data Formatting ---
    const startDate = event.date ? new Date(event.date) : null;
    const startDateStr = startDate ? startDate.toLocaleDateString('en-US', { dateStyle: 'full' }) : 'N/A';
    const displayTime = event.time || '';
    let feeDisplay = 'Free';
    if (event.registrationFee && parseFloat(event.registrationFee) > 0) {
        feeDisplay = `$${parseFloat(event.registrationFee).toFixed(2)}`;
    } else if (event.registrationFee == null) { // Check specifically for null/undefined if backend might omit it
        feeDisplay = 'N/A';
    }

    // --- HTML Structure ---
    panelElement.innerHTML = `
        <img src="${event.imageUrl || 'images/default-event.jpg'}" alt="${event.title || 'Event'} Banner" class="detail-event-image">
        <h2>${event.title || 'Untitled Event'}</h2>
        <div class="meta-info">
            <span><strong>Date:</strong> ${startDateStr} ${displayTime ? `- ${displayTime}`: ''}</span>
            <span><strong>Mode:</strong> ${event.mode || 'N/A'} ${event.mode === 'Offline' && event.location ? `(${event.location})` : ''}</span>
            <span><strong>Category:</strong> ${event.category || 'N/A'}</span>
            <span><strong>Type:</strong> ${event.type || 'N/A'}</span> <!-- Display if available -->
            <span class="event-fee-display"><strong>Fee:</strong> ${feeDisplay}</span>
        </div>
        <hr style="margin: 1rem 0;">
        <div class="description">
            <h4>Description</h4>
            <p>${(event.description || 'No description provided.').replace(/\n/g, '<br>')}</p>
        </div>
         ${event.organizer ? `<div class="details-section organizer-info"><h4>Organizer</h4><p>${event.organizer}</p></div>` : ''}
         ${event.details ? `<div class="details-section extra-details"><h4>Additional Details</h4><p>${(event.details || '').replace(/\n/g, '<br>')}</p></div>` : ''}
        ${event.registrationLink ? `<a href="${event.registrationLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top: 1rem;">Register / Visit Page</a>` : ''}
         <div id="panel-event-actions" style="margin-top: 20px;"></div>
    `;

    // Optional: Check ownership to add Edit/Delete buttons specific to the panel
    // checkEventOwnership(event, 'panel-event-actions');
}

/**
 * Fetches details for a specific event and calls displayEventDetailPanel.
 * @param {string} eventId - The ID (_id) of the event to fetch.
 * @param {HTMLElement} panelElement - The DOM element where details should be displayed.
 */
async function loadAndDisplayEventDetail(eventId, panelElement) {
     if (!panelElement) return;
     if (!eventId) {
         panelElement.innerHTML = '<p>Invalid event selected.</p>';
         panelElement.classList.add('placeholder');
         return;
     }
     console.log(` -> loadAndDisplayEventDetail: Fetching details for event ID ${eventId}`);
     panelElement.classList.remove('placeholder');
     panelElement.innerHTML = '<p>Loading event details...</p>';
     try {
         const eventDetails = await fetchAPI(`/events/${eventId}`); // Fetch by ID
         if (!eventDetails) throw new Error("Event not found or API returned no data.");
         displayEventDetailPanel(eventDetails, panelElement);
     } catch (error) {
         console.error(`   ❌ ERROR fetching details for event ${eventId}:`, error);
         panelElement.innerHTML = `<p class="error">Error loading event details: ${error.message}</p>`;
          // Keep it from looking empty, but maybe don't add placeholder class back
     }
}

/**
 * Displays recent events in the Swiper carousel.
 * @param {Array} events - Array of event objects.
 * @param {HTMLElement} wrapperElement - The Swiper wrapper element (#recent-events-carousel).
 */
function displayRecentEventsCarousel(events, wrapperElement) {
    console.log("🎠 displayRecentEventsCarousel called. Received events:", events ? events.length : 'null/undefined');

    if (!wrapperElement) { console.error("❌ ERROR: Recent events wrapper element NOT FOUND!"); return; }
    console.log("   - Wrapper found. Clearing content.");
    wrapperElement.innerHTML = ''; // Clear loading message

    if (!events || !Array.isArray(events) || events.length === 0) {
        console.warn("   - No valid recent events array to display.");
        // Optionally display a message directly in the wrapper or hide the section
         wrapperElement.innerHTML = '<p style="padding: 20px; text-align: center; color: #888;">No recent events available.</p>';
        const parentSection = wrapperElement.closest('.recent-events-section');
        //if(parentSection) parentSection.style.display = 'none'; // Hide if empty? Your choice.
        return;
    }

    console.log(`   - Rendering ${events.length} slides...`);
    const parentSection = wrapperElement.closest('.recent-events-section');
    if (parentSection) parentSection.style.display = 'block'; // Ensure section is visible

    try {
        events.forEach((event, index) => {
             // Basic check for valid event object
             if (!event || typeof event !== 'object' || !event._id) {
                 console.warn(`      -> Skipping recent event index ${index}: Invalid data or missing ID.`);
                 return; // Skip this iteration
             }
             // console.log(`      -> Processing event index ${index}: ${event.title}`);

             const slide = document.createElement('div'); slide.classList.add('swiper-slide');
             const card = document.createElement('div'); card.classList.add('recent-event-card');
             const eventDate = event.date ? new Date(event.date) : null;
             const formattedDate = eventDate ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
             const imageUrl = event.imageUrl || 'images/default-event.jpg';
             const eventTitle = event.title || 'Untitled Event';

             card.innerHTML = `
                 <a href="event-details.html?id=${event._id}" class="recent-event-link">
                     <img src="${imageUrl}" alt="${eventTitle}">
                     <div class="recent-event-overlay"><h4>${eventTitle}</h4><p>📅 ${formattedDate}</p></div>
                 </a>`;
             slide.appendChild(card);
             wrapperElement.appendChild(slide);
              // console.log(`         - Slide for "${eventTitle}" appended.`);
         }); // End forEach

        console.log("   ✅ Slides loop completed. Initializing Swiper...");
         try {
             if (typeof Swiper === 'undefined') throw new Error("Swiper library not loaded!");
             if (recentEventsSwiper) { recentEventsSwiper.destroy(true, true); recentEventsSwiper = null; }
             recentEventsSwiper = new Swiper('.recent-events-swiper', {
                 slidesPerView: 1.5, spaceBetween: 15,
                 breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 25 }, 1024: { slidesPerView: 4, spaceBetween: 30 } },
                 navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                 pagination: { el: '.swiper-pagination', clickable: true }, loop: events.length > 4, // Loop only if enough slides to make sense
             });
             console.log("   🎉 Swiper initialized!");
         } catch (swiperError) {
             console.error("   ❌ ERROR during Swiper initialization:", swiperError);
             wrapperElement.innerHTML = `<p class="error" style="text-align:center; width: 100%; padding: 20px;">Error initializing slider.</p>`;
         }
    } catch (loopError) {
        console.error("   ❌ ERROR during event loop or appending slides:", loopError);
        wrapperElement.innerHTML = `<p class="error">Error displaying recent events slides.</p>`;
    }
}

/**
 * Displays featured events (e.g., on index.html).
 * @param {Array} featuredEvents - Array of event objects marked as featured.
 * @param {HTMLElement} containerElement - The DOM element to append items to.
 */
function displayFeaturedEvents(featuredEvents, containerElement) {
     if (!containerElement) return; containerElement.innerHTML = '';
     if (!featuredEvents || featuredEvents.length === 0) { containerElement.innerHTML = '<p>No featured events available right now.</p>'; return; }
     // ... (Logic to create and append featured event items - same as before) ...
     featuredEvents.forEach(event => {
         const featuredItem = document.createElement('div');
         featuredItem.classList.add('featured-event-item');
         featuredItem.innerHTML = `
             <a href="event-details.html?id=${event._id}" style="text-decoration: none; color: inherit;">
                <img src="${event.imageUrl || 'images/default-event.jpg'}" alt="${event.title || 'Event'}">
                <p>${event.title || 'Untitled Event'}</p>
             </a>`;
         containerElement.appendChild(featuredItem);
     });
}


/**
 * Main function to load events based on the current page (index or events).
 * Handles fetching recent events (events page) and filtered/all events.
 */
async function loadEvents() {
    const isIndexPage = !!document.getElementById('featured-events-container');
    const isEventsPage = !!document.getElementById('event-list-container'); // Primary check for events page

    console.log(`▶️ loadEvents CALLED. isIndex: ${isIndexPage}, isEvents: ${isEventsPage}`);

    if (!isIndexPage && !isEventsPage) { console.log(" loadEvents: Exiting, not on index or events page."); return; }

    // --- Events Page Logic ---
    if (isEventsPage) {
        console.log("  -> Running logic for Events Page.");

        // 1. Load Recent Events Carousel (Independent API Call)
        console.log("     - Attempting to fetch RECENT events...");
        if (recentEventsCarouselWrapper) recentEventsCarouselWrapper.innerHTML = '<p>Fetching recent events...</p>';
        else console.warn("     - Recent events carousel wrapper not found!");
        try {
            const recentApiEndpoint = '/events?limit=8';
            console.log(`     - Calling fetchAPI for RECENT: ${recentApiEndpoint}`);
            const recentEvents = await fetchAPI(recentApiEndpoint);
            console.log(`     - fetchAPI for RECENT completed. Found ${recentEvents?.length || 0} events.`);
            if (recentEventsCarouselWrapper) displayRecentEventsCarousel(recentEvents || [], recentEventsCarouselWrapper);
        } catch (error) {
            console.error('     - ❌ ERROR fetching/displaying recent events:', error);
            if (recentEventsCarouselWrapper) recentEventsCarouselWrapper.innerHTML = `<p class="error">Error loading recent events: ${error.message}</p>`;
        }

        // 2. Load Filtered Event List
        console.log("     - Attempting to fetch FILTERED events list...");
        if (eventListContainer) eventListContainer.innerHTML = '<p>Fetching events list...</p>';
        else console.warn("     - Event list container not found!");
        if (eventDetailPanel) { // Reset detail panel
            eventDetailPanel.innerHTML = '<p>Select an event from the list.</p>';
            eventDetailPanel.classList.add('placeholder');
        }
        const params = new URLSearchParams(); let listEndpoint = '/events';
        if (searchBar?.value) params.append('search', searchBar.value);
        if (modeFilter?.value) params.append('mode', modeFilter.value);
        if (feeFilter?.value) params.append('paid', feeFilter.value);
        if (categoryFilter?.value) params.append('category', categoryFilter.value);
        const listQueryString = params.toString(); if (listQueryString) listEndpoint += `?${listQueryString}`;

        try {
            console.log(`     - Calling fetchAPI for FILTERED list: ${listEndpoint}`);
            const filteredEvents = await fetchAPI(listEndpoint);
            console.log(`     - fetchAPI for FILTERED list completed. Found ${filteredEvents?.length || 0} events.`);
            if (eventListContainer) displayEventList(filteredEvents || [], eventListContainer);
        } catch (error) {
            console.error('     - ❌ ERROR fetching/displaying filtered events list:', error);
            if (eventListContainer) eventListContainer.innerHTML = `<p class="error">Error loading events list: ${error.message}</p>`;
        }

    // --- Index Page Logic ---
    } else if (isIndexPage) {
        console.log("  -> Running logic for Index Page (Featured Events).");
        if (featuredEventsContainer) featuredEventsContainer.innerHTML = '<p>Fetching featured events...</p>';
        else console.warn("     - Featured events container not found!");
        try {
            const featuredApiEndpoint = '/events?featured=true';
            console.log(`     - Calling fetchAPI for FEATURED: ${featuredApiEndpoint}`);
            const featuredEvents = await fetchAPI(featuredApiEndpoint);
            console.log(`     - fetchAPI for FEATURED completed. Found ${featuredEvents?.length || 0} events.`);
             if (featuredEventsContainer) {
                 // Filter client-side if backend doesn't support featured=true reliably
                 // const featured = featuredEvents.filter(e => e.isFeatured); // If needed
                 displayFeaturedEvents(featuredEvents || [], featuredEventsContainer);
             }
        } catch (error) {
            console.error('     - ❌ ERROR fetching/displaying featured events:', error);
            if (featuredEventsContainer) featuredEventsContainer.innerHTML = `<p class="error">Error loading featured events.</p>`;
        }
    }
    console.log("◀️ loadEvents FINISHED.");
}

/**
 * Loads details for the standalone event details page.
 */
async function loadEventDetailsPage() {
    if (!eventDetailsContent) return;
    console.log(" -> loadEventDetailsPage: Running for standalone page.");
    const mainContainer = document.querySelector('.event-details-container'); // Add back button
     if (mainContainer && !mainContainer.querySelector('.back-button')) {
         const backButton = document.createElement('button'); backButton.innerHTML = '← Back';
         backButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'back-button');
         backButton.onclick = () => history.back(); mainContainer.prepend(backButton);
     }
    const urlParams = new URLSearchParams(window.location.search); const eventId = urlParams.get('id');
    if (!eventId) { eventDetailsContent.innerHTML = '<p class="error">No event ID found in URL.</p>'; return; }
    eventDetailsContent.innerHTML = '<p>Loading event details...</p>';
    try {
        const event = await fetchAPI(`/events/${eventId}`);
        if (!event) throw new Error("Event data not found.");
        document.title = `${event.title || 'Event Details'} - CampusEvents`;
        let feeDisplay = 'Free'; /* ... fee formatting ... */
        if(event.registrationFee > 0) feeDisplay = `$${parseFloat(event.registrationFee).toFixed(2)}`;
        else if (event.registrationFee == null) feeDisplay = 'N/A';
        const startDate = event.date ? new Date(event.date) : null; /* ... date formatting ... */
        const startDateStr = startDate ? startDate.toLocaleDateString('en-US', { dateStyle: 'full' }) : 'N/A';
        const displayTime = event.time || '';
        // Use consistent HTML structure
        eventDetailsContent.innerHTML = `
            <img src="${event.imageUrl || 'images/default-event.jpg'}" alt="${event.title || 'Event'}" class="event-banner">
            <h1>${event.title || 'Untitled Event'}</h1>
            <div class="meta-info">
                 <span>📅 Date: ${startDateStr} ${displayTime ? `- ${displayTime}`: ''}</span>
                 <span>📍 Mode: ${event.mode || 'N/A'} ${event.mode === 'Offline' && event.location ? `(${event.location})` : ''}</span>
                 <span>🏷️ Category: ${event.category || 'N/A'}</span>
                 <span>🏛️ Type: ${event.type || 'N/A'}</span>
                 <span class="event-fee-display">💰 Fee: ${feeDisplay}</span>
            </div> <hr style="margin: 1rem 0;">
            <div class="description"><h2>Description</h2><p>${(event.description || '').replace(/\n/g, '<br>')}</p></div>
            ${event.organizer ? `<div class="details-section organizer-info"><h2>Organizer</h2><p>${event.organizer}</p></div>` : ''}
            ${event.details ? `<div class="details-section extra-details"><h2>Additional Details</h2><p>${(event.details || '').replace(/\n/g, '<br>')}</p></div>` : ''}
            ${event.registrationLink ? `<a href="${event.registrationLink}" target="_blank" class="btn btn-primary official-link" style="margin-top: 1rem;">Register / Visit Page</a>` : ''}
             <div id="event-actions" style="margin-top: 20px;"></div>`;
        checkEventOwnership(event);
    } catch (error) { console.error('❌ ERROR Failed to load event details page:', error); eventDetailsContent.innerHTML = `<p class="error">Error: ${error.message}</p>`; }
}

/**
 * Checks if the current user owns the event and adds Edit/Delete buttons.
 * @param {object} event - The event object (must have 'createdBy' property).
 * @param {string} [containerId='event-actions'] - The ID of the container for the buttons.
 */
function checkEventOwnership(event, containerId = 'event-actions') {
     // ... (Previous implementation is likely correct, ensures user is fetched/stored in localStorage) ...
     const userStr = localStorage.getItem('user'); if (!userStr) return;
     try {
         const currentUser = JSON.parse(userStr);
         const eventActionsContainer = document.getElementById(containerId);
         if (eventActionsContainer && event?.createdBy && currentUser?.id && event.createdBy === currentUser.id) {
             eventActionsContainer.innerHTML = ''; // Clear previous buttons
             const editButton = document.createElement('button'); editButton.textContent = 'Edit'; /* ... classes, style, click ... */ editButton.onclick = () => alert('Edit not implemented');
             const deleteButton = document.createElement('button'); deleteButton.textContent = 'Delete'; /* ... classes, style, click ...*/ deleteButton.onclick = () => handleDeleteEvent(event._id);
             eventActionsContainer.appendChild(editButton); eventActionsContainer.appendChild(deleteButton);
         }
     } catch(e) { console.error("Error checking ownership:", e); }
}

/**
 * Handles the deletion of an event after confirmation.
 * @param {string} eventId - The ID (_id) of the event to delete.
 */
async function handleDeleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    console.log(`Attempting to delete event ID: ${eventId}`);
    try {
         await fetchAPI(`/events/${eventId}`, { method: 'DELETE' });
         alert('Event deleted successfully!');
         window.location.href = 'events.html'; // Go back to events list
    } catch (error) { console.error('❌ Failed to delete event:', error); alert(`Error deleting event: ${error.message}`); }
}


// --- Document Ready Listener ---
document.addEventListener('DOMContentLoaded', () => {
     const pathname = window.location.pathname;
     console.log("✅ DOM Loaded for page:", pathname);

     // --- Attach Organize Form Listener ---
     if (pathname.endsWith('/organize.html')) {
        console.log("⏳ On Organize Page, looking for form...");
        const organizeFormElement = document.getElementById('organize-form'); // Get element *after* DOM loaded
        if (organizeFormElement) {
             console.log("✅ Organize form FOUND. Attaching submit listener.");
             organizeFormElement.addEventListener('submit', async (e) => {
                 console.log("🚀 Submit button CLICKED! Running listener callback..."); e.preventDefault();
                 const messageEl = document.getElementById('organize-message');
                 if (messageEl) { messageEl.textContent = ''; messageEl.style.display = 'none'; }
                 console.log("📝 Gathering form data...");
                 // --- Data Gathering ---
                 const title = document.getElementById('event-title')?.value;
                 const description = document.getElementById('event-description')?.value;
                 const date = document.getElementById('event-date')?.value;
                 const time = document.getElementById('event-time')?.value || null;
                 const mode = document.getElementById('event-mode')?.value;
                 const category = document.getElementById('event-category')?.value;
                 const type = document.getElementById('event-type')?.value; // Get type
                 const imageUrl = document.getElementById('event-imageUrl')?.value || null;
                 const registrationLink = document.getElementById('event-detailsUrl')?.value || null;
                 const organizerName = document.getElementById('event-organizerName')?.value;
                 const organizerContact = document.getElementById('event-organizerContact')?.value;
                 const feeValue = document.getElementById('event-fee')?.value;
                 const registrationFee = feeValue ? parseFloat(feeValue) : 0;
                 const locationValue = document.getElementById('location')?.value || null;
                 const location = (mode === 'Offline' && locationValue) ? locationValue : null;
                 let organizer = "CampusEvents";
                 if (organizerName && organizerContact) organizer = `${organizerName} (${organizerContact})`; else if (organizerName) organizer = organizerName; else if (organizerContact) organizer = organizerContact;
                 console.log("📊 Data Gathered:", {title, date, mode, category, type, organizer, location, registrationFee});
                 // --- Frontend Validation ---
                 console.log("🛡️ Running frontend validation..."); let missing = [];
                 if (!title) missing.push('Title'); if (!description) missing.push('Description'); if (!date) missing.push('Event Date'); if (!mode) missing.push('Mode');
                 if (mode === 'Offline' && !location) missing.push('Location (for Offline mode)'); if (!category) missing.push('Category');
                 if (!type) { missing.push('Type'); } // Check if type is selected
                 if (!organizerName && !organizerContact) missing.push('Organizer Name or Contact'); if (isNaN(registrationFee) || registrationFee < 0) missing.push('Valid Registration Fee');
                 if (missing.length > 0) { console.error("❌ Validation FAILED:", missing); if (typeof showMessage === 'function') showMessage('organize-message', `Required: ${missing.join(', ')}.`, true); return; }
                 console.log("✅ Validation PASSED.");
                 // --- Construct Payload (including type)---
                 const eventData = { title, description, date, time, mode, category, type, location, imageUrl, registrationLink, organizer, registrationFee };
                 console.log("📦 Payload:", JSON.stringify(eventData, null, 2));
                 // --- API Call ---
                 try {
                     console.log("📡 Calling fetchAPI POST /api/events..."); if (typeof fetchAPI !== 'function') throw new Error("fetchAPI missing!");
                     const createdEvent = await fetchAPI('/events', { method: 'POST', body: JSON.stringify(eventData) });
                     console.log("✅ API Success:", createdEvent); if (typeof showMessage === 'function') showMessage('organize-message', 'Event submitted!', false); else alert('Event submitted!');
                     organizeFormElement.reset();
                     // Optional: Call toggleLocationField() if needed after reset
                     setTimeout(() => { window.location.href = `event-details.html?id=${createdEvent._id}`; }, 1500);
                 } catch (error) { console.error("❌ API call FAILED:", error); const errorMsg = error.message || 'Unknown error.'; if (typeof showMessage === 'function') showMessage('organize-message', `Error: ${errorMsg}`, true); else alert(`Error: ${errorMsg}`); }
             }); // End submit listener
         } else { console.error("❌ Organize form element NOT FOUND!"); }
     } // End if organize page

     // --- Initial Page Load Logic ---
     if (pathname.endsWith('/') || pathname.endsWith('/index.html')) { console.log("🚀 Triggering loadEvents for Index Page."); loadEvents(); }
     else if (pathname.endsWith('/events.html')) { console.log("🚀 Triggering loadEvents for Events Page."); loadEvents(); if (filterButton) { filterButton.addEventListener('click', loadEvents); } if (searchBar) { searchBar.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadEvents(); }); } }
     else if (pathname.endsWith('/event-details.html')) { console.log("🚀 Loading Event Details Page content."); loadEventDetailsPage(); }
});
// --- END OF FILE js/events.js ---