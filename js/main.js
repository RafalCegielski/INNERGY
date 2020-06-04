"use strict";
class Stuff {
    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }
    static sort(data) {
        return data.sort((a, b) => a.id > b.id
            ? 1
            : -1);
    }
}
class Warehouse {
    constructor(name, totalQuantity, stuff) {
        this.name = name;
        this.totalQuantity = totalQuantity;
        this.stuff = stuff;
    }
    static sort(data) {
        return data.sort((a, b) => a.totalQuantity > b.totalQuantity ? -1
            : a.totalQuantity === b.totalQuantity
                ? (a.name > b.name
                    ? -1
                    : 1)
                : 1);
    }
}
class Parser {
    parseString(data) {
        let warehouses = new Array();
        let linesOfdata = data.split('\n');
        linesOfdata.forEach(line => {
            if (!line.includes('#') && line !== '') {
                let splitedLine = line.split(';');
                if (splitedLine.length > 2) {
                    let warehouseWithQuantity = splitedLine[2].split('|');
                    warehouseWithQuantity.forEach(element => {
                        let splittedWarehouseWithQuantityItem = element.split(',');
                        let targetWarehouses = warehouses.filter(e => e.name === splittedWarehouseWithQuantityItem[0]);
                        let newStuff = new Stuff(splitedLine[1], Number(splittedWarehouseWithQuantityItem[1]));
                        if (targetWarehouses.length === 1) {
                            let targetWarehouse = targetWarehouses[0];
                            targetWarehouse.stuff.push(newStuff);
                            targetWarehouse.totalQuantity += Number(splittedWarehouseWithQuantityItem[1]);
                        }
                        else if (targetWarehouses.length === 0) {
                            warehouses.push(new Warehouse(splittedWarehouseWithQuantityItem[0], Number(splittedWarehouseWithQuantityItem[1]), [newStuff]));
                        }
                    });
                }
            }
        });
        return warehouses;
    }
    parseWerehouseArray(data) {
        const resultString = Warehouse.sort(data).reduce((acc, element) => {
            const str = `${element.name} (total ${element.totalQuantity})<br/>`;
            const stuff = Stuff.sort(element.stuff).map(stuff => `${stuff.id}: ${stuff.quantity}<br/>`).join('');
            acc = `${acc}${str}${stuff}<br/>`;
            return acc;
        }, '');
        return resultString;
        // let resultString = "";
        // Warehouse.sort(data).forEach(element => {
        //     resultString += `${element.name} (total ${element.totalQuantity})<br/>`;
        //     Stuff.sort(element.stuff).forEach(stuff => {
        //         resultString += `${stuff.id}: ${stuff.quantity}<br/>`;
        //     });
        //     resultString += "<br/>";
        // });
        // return resultString;
    }
}
let parser = new Parser();
function processData() {
    const resultContainer = document.getElementById('resultContainer');
    const initData = document.getElementById('initData');
    if (resultContainer && initData) {
        resultContainer.innerHTML = parser.parseWerehouseArray(parser.parseString(initData.value));
    }
}
