// import { PermissionsAndroid } from 'react-native';
// import SmsAndroid from 'react-native';
//
// type SMSData = {
//     _id: string;
//     address: string;
//     body: string;
// };
//
// export const checkSMSPermission = async (): Promise<boolean> => {
//     const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
//     if (hasPermission) {
//         return true;
//     }
//
//     const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
//     return status === PermissionsAndroid.RESULTS.GRANTED;
// };
//
// // Define the structure for the function parameters and their types
// type ListOptions = {
//     box: string;
//     minDate: number;
//     maxDate: number;
// };
//
// export const readSMS = async (): Promise<SMSData[]> => {
//     if (await checkSMSPermission()) {
//         return new Promise((resolve, reject) => {
//             const options: ListOptions = {
//                 box: 'inbox',
//                 minDate: new Date().getTime() - 1000 * 60 * 60 * 24 * 30, // From last 30 days
//                 maxDate: new Date().getTime(), // To now
//             };
//
//             SmsAndroid.list(
//                 JSON.stringify(options),
//                 (fail: string) => {
//                     console.error('Failed with this error: ' + fail);
//                     reject(new Error(fail));
//                 },
//                 (count: number, smsList: string) => {
//                     console.log('Count: ', count);
//                     console.log('List: ', smsList);
//                     let arr = JSON.parse(smsList) as SMSData[];
//                     resolve(arr);
//                 },
//             );
//         });
//     } else {
//         throw new Error('SMS permission denied');
//     }
// };
