// Character Service - Handles data retrieval and management
const CharacterService = {
    data: null,

    // Initialize the service
    init: function() {
        if (window.charactersData) {
            this.data = window.charactersData;
            console.log('CharacterService initialized with', Object.keys(this.data).length, 'characters');
        } else {
            console.error('Character data not found. Please ensure resources/characters-data.js is loaded.');
            this.data = {};
        }
    },

    // Get all characters as an array
    getAllCharacters: function() {
        if (!this.data) this.init();
        return Object.values(this.data);
    },

    // Get a specific character by ID
    getCharacterById: function(id) {
        if (!this.data) this.init();
        return this.data[id] || null;
    },

    // Search characters by name or alias
    searchCharacters: function(query) {
        if (!this.data) this.init();
        const lowerQuery = query.toLowerCase();
        return Object.values(this.data).filter(char => 
            char.name.includes(query) || 
            (char.aliases && char.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)))
        );
    }
};

// Auto-initialize if loaded in browser
if (typeof window !== 'undefined') {
    window.CharacterService = CharacterService;
    // We can also listen for DOMContentLoaded to init, but lazy init in methods is fine too.
}

if (typeof module !== 'undefined') {
    module.exports = CharacterService;
}
