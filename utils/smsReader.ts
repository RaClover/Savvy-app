// // utils/smsReader.ts
// import SmsAndroid from 'react-native-get-sms-android';
//
// export interface SmsMessage {
//     _id: string;
//     address: string;
//     body: string;
//     date: string;
// }
//
// export const fetchBankSMS = async (creationTime: number): Promise<SmsMessage[]> => {
//     return new Promise((resolve, reject) => {
//         const filter = {
//             box: 'inbox',
//             read: 1,
//             maxCount: 50,
//         };
//
//         SmsAndroid.list(
//             JSON.stringify(filter),
//             (fail: string) => {
//                 console.error('Failed to fetch SMS:', fail);
//                 reject(fail);
//             },
//             (count: any, smsList: string) => {
//                 const messages: SmsMessage[] = JSON.parse(smsList);
//                 console.log("Fetched SMS:", messages); // Log fetched messages for debugging
//
//                 const filteredMessages = messages.filter((msg: SmsMessage) =>
//                     parseInt(msg.date) > creationTime &&
//                     new RegExp('Bank|The bank|African Bank|afgBank|cfsbank|myBank|OilBank|Tinkoff|HSBC|Bank of China|SberBank|VTB|Russian Bank|Bank of Russia', 'i').test(msg.address)
//                 );
//                 resolve(filteredMessages);
//             },
//         );
//     });
// };
