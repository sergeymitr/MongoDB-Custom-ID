db.system.js.save({
    _id: 'custom_id',
    value: function(collectionName, prefix) {
        var entity, entities, curNum = 0, id = null, customID;
        var collection = db.getCollection(collectionName);

        // find last entity that uses specified prefix
        entities = collection.find({ custom_id: { $regex: '^' + prefix + '\d', $options: 'i' } }).sort({ _id: -1 }).limit(1);
        if (entities.hasNext()) {
            entity = entities.next(); 
        }
        if (entity && entity.custom_id) {
            // determine last prefix
            curNum = parseInt(entity.custom_id.split(prefix).join(''));
        }

        /**
         * ensure the created custom ID is unique
         * in case another instance of the script has added it
         * (don't forget to create an unique index, see above)
         */
        // we will try five times max to avoid endless loop
        var limit = 5;
        do {
            customID = prefix + ++curNum;
            id = ObjectId();
            collection.insert({ _id: id, custom_id: customID });
        } while (!collection.find({ _id: id }).count() && --limit);

        return id || false;
    }
});
