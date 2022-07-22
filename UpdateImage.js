async function updateitems(req, res) {
    //console.log(req.body)
    let item_name = req.body.item_name;
    let item_price = req.body.item_price;
    let item_quantity = req.body.item_quantity;
    let item_id = req.body.item_id;
    let item_image = req.body.item_image.item_image;

    let discount = req.body.discount == "" ? '0': req.body.discount;

    let sql = 'SELECT item_image FROM ekart_items WHERE item_id = ?'
    db_connection.query(sql, [item_id], function (err, data) {
        for (i = 0; i < data.length; i++) {
            file_name = data[i].item_image;
        }
        if (data.length > 0) {
            if (item_image == '/images/items/' + file_name) {
                let sql = 'UPDATE ekart_items SET item_name = ?, item_price = ?, item_quantity=?, discount = ? WHERE item_id = ?';
                db_connection.query(sql, [item_name, item_price, item_quantity,discount, item_id], function (err, data) {
                    console.log(data)
                    if (err) throw err;
                    return res.send({ "status": "true", "message": "Updated the Item details", "data": data })

                })
            } else {
                let buff = new Buffer.from(item_image, 'base64');
                const filename = `item_${Date.now()}.png`;
                let filepath = fs.writeFileSync('images/items/' + filename, buff);
                fs.unlinkSync('images/items/' + file_name)
                let sql = 'UPDATE ekart_items SET item_name = ?, item_price = ?, item_quantity=?, item_image= ?, discount = ? WHERE item_id = ?';
                db_connection.query(sql, [item_name, item_price, item_quantity, filename,discount, item_id], function (err, data) {
                    console.log(data)
                    if (err) throw err;
                    return res.send({ "status": "true", "message": "Updated the Item details", "data": data })

                })
            }

        }

    })

}