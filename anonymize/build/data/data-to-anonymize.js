"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataToAnonymize = void 0;
var M1 = { id: "msg1", requester: { id: "req1", name: "Elon Musk", email: "elon.musk@tesla.com" }, submitter: { id: "submit1", name: "jean dujardin", email: "jean.dujardin@oss.fr" } };
var M2 = { id: "msg2", requester: { id: "req2", name: "Steve Jobs", email: "steve.jobs@rip.com" }, submitter: { id: "submit2", name: "jean dujardin", email: "jean.dujardin@oss.fr" } };
exports.dataToAnonymize = [M1, M2];
