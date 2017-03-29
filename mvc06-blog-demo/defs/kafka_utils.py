import base64
import json

from commands import getstatusoutput


# produce_template = ("curl -s -X POST -H \"Content-Type: application/vnd.kafka.binary.v1+json\" " +
#                     "--data \'{\"records\":[{\"value\":\"%(data)s\"}]}\' " +
#                     "\"http://%(ip)s:8082/topics/%(topic)s\"")

produce_template = ("curl -s -X POST -H \"Content-Type: application/vnd.kafka.binary.v1+json\" " +
                    "--data \'{\"records\":[{\"key\":\"%(key)s\", \"value\":\"%(data)s\"}]}\' " +
                    "\"http://%(ip)s:8082/topics/%(topic)s\"")

consume_id_template = ("curl -s -X POST -H \"Content-Type: application/vnd.kafka.v1+json\" " +
                       "--data \'{\"format\": \"binary\", \"auto.offset.reset\": \"smallest\"}\' " +
                       "http://%(ip)s:8082/consumers/my_binary_consumer")

consume_template = ("curl -s -X GET -H \"Accept: application/vnd.kafka.binary.v1+json\" " +
                    "%(base_uri)s/topics/%(topic)s")

get_by_offset_template = ("curl -s \"http://%(ip)s:8082/topics/%(topic)s/partitions/%(partition)s/messages?offset=%(offset)s\"")


class KafkaRestAPIWrapper(object):
    def __init__(self):
        self.env_dict = {"ip": "192.168.20.183"}
        pass

    def id_uri_from_json(self, json_dict):
        self.env_dict["instance_id"] = json_dict["instance_id"]
        self.env_dict["base_uri"] = json_dict["base_uri"]

    def load_consume_id_from_file(self, filepath):
        with open(filepath, "r") as fid:
            lines = fid.readlines()
        self.id_uri_from_json(json.loads(lines[-1]))

    def get_consume_id(self):
        run_result = getstatusoutput(consume_id_template % self.env_dict)
        with open("id_instance.txt", "a") as fid:
            fid.write("%s\n" % run_result[1])

        self.id_uri_from_json(json.loads(run_result[1]))

    def fetch(self, topic, offset, partition=0):
        mame = self.env_dict.copy()
        mame["topic"] = topic
        mame["partition"] = partition
        mame["offset"] = offset
        run_result = getstatusoutput(get_by_offset_template % mame)
        return run_result[1]

    def produce(self, topic, key, data):
        mame = self.env_dict.copy()
        mame["topic"] = topic
        mame["key"] = base64.b64encode(key)
        mame["data"] = base64.b64encode(data)
        print(produce_template % mame)
        run_result = getstatusoutput(produce_template % mame)
        return run_result[1]

    def consume(self, topic):
        mame = self.env_dict.copy()
        mame["topic"] = topic
        run_result = getstatusoutput(consume_template % mame)
        return run_result[1]

if __name__ == '__main__':
    client = KafkaRestAPIWrapper()
    client.load_consume_id_from_file("id_instance.txt")
    client.fetch("key-a", 24)

