export class Feedback {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agree: boolean;
    contacttype: string;
    message: string;
};
export class Review {
rating: number;
comment: string;
author: string;
date: string;

};

export const ContactType = ['None', 'Tel', 'Email'];