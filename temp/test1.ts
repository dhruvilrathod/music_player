// interface Car {
//     companyName: string;
//     model: string;
//     startCar(): boolean
// }

// abstract class CarsFactory {
//     public abstract companyName: string;
//     public abstract getCarFromFactory(): Car;
//     public getCarsFactoryStatus(): boolean {
//         return new Date().getTime() % 2 == 0 ? true : false;
//     }
// }

// class HondaFactory extends CarsFactory {
//     public companyName: string = 'Honda';

//     public getCarFromFactory(): Car {
//         return new HondaCar();
//     }

// }

// class HondaCar extends CarsFactory implements Car {
    
//     public companyName: string = 'Honda';
    
//     public model: string = 'Civic';

//     public getCarFromFactory(): Car {   
//         throw new Error("Method not implemented.");
//     }


//     startCar(): boolean {
//         return new Date().getTime() % 2 == 0 ? true : false;
//     }
    
// }
// let c = new HondaCar()
// console.log(c);


var a:Promise<any> = new Promise((returnValue) => {
    console.log('hello from promise');
    setTimeout(() => {
        returnValue(true);
    }, 5000);
});

a.then((getFromPromise) => console.log({getFromPromise}))
console.log(a);
console.log('hello1');
