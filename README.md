MongoDB Custom ID
=================

##Create Unique Index
First of all we need to create a sparse unique index for each collection that is supposed to have a custom ID. You can do it by executing following command (don't forget to replace `collection_name` with the actual name of your collection):

```
db.getCollection('collection_name').ensureIndex( { custom_id: 1 }, { unique: true, sparse: true } );
```

##Store on the Server
The easiest way to access the function is to store it on the MongoDB Server. It will be added into the collection `system.js` of active database, therefore you need to install a copy for each database you need.
Here is how you can import it:

```
mongo localhost:27017/database_name customid.js
```

You are also free to perform the script source code directly in your preferred MongoDB client.

##Usage
Now you can call the function:

```
db.loadServerScripts();
var id = custom_id('test', 'SM');
```

An empty entry is created that contains only two fields:

```
{
    "_id" : ObjectId("5516b7e6dee4810687faee77"),
    "custom_id" : "SM1"
}
```

As you see, an unique ```custom_id``` was assigned, it won't be duplicated and you can rely on it. The value looks much better than the hexadecimal ```_id```, the business would be pleased.

##PHP Example
Performing the script by PHP is easy as well.
Here is an example:

```
$code = new MongoCode("custom_id('collection_name', 'SM')");
$transaction_id = $mongo->command(array('eval' => $code));
$transaction_id = empty($transaction_id['retval']['str']) ? null : $transaction_id['retval']['str'];
```

First, we create a MongoCode instance to call the function. We don't need to call ```db.loadServerScripts()``` since all scripts are loaded automatically. Then we pass it into the Mongo ```command()``` function and retrieve the ```_id``` value.
```$transaction_id``` contains MongoDB default ```_id``` value, so you can perform an update to save any information you need.