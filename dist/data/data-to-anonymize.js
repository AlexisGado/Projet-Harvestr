"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToAnonymize = void 0;
const CompanyReq1 = { id: "company1", name: "Tesla" };
const CompanySub1 = { id: "company1", name: "Hollywood" };
const Requester1 = {
    id: "req1",
    name: "Elon Musk",
    email: "elon.musk@tesla.com",
    organization: CompanyReq1
};
const Submitter1 = {
    id: "submit1",
    name: "jean dujardin",
    email: "jean.dujardin@oss.fr",
    organization: CompanySub1
};
const SubMessage1 = {
    id: "submes1",
    submitter: Requester1,
    content: "paypal tesla and company"
};
const Requester2 = {
    id: "req2",
    name: "Steve Jobs",
    email: "steve.jobs@rip.com"
};
const Submitter2 = {
    id: "submit2",
    name: "jean dujardin",
    email: "jean.dujardin@oss.fr"
};
//Example messages adapted to the blacklist
const M1 = {
    id: "msg1",
    requester: Requester1,
    submitter: Submitter1,
    title: "Paypal paying",
    content: "I'm sad that paypal not pay",
    sub_messages: [SubMessage1, SubMessage1]
};
const M2 = {
    id: "msg2",
    requester: Requester2,
    submitter: Submitter2,
    title: "Apple film",
    content: "I want to play in an apple film"
};
exports.dataToAnonymize = [M1, M2];
//# sourceMappingURL=data-to-anonymize.js.map