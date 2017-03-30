import base64
import json

from commands import getstatusoutput


produce_template = ("curl -s -X POST -H \"Content-Type: application/vnd.kafka.binary.v1+json\" " +
                    "--data \'{\"records\":[{\"key\":\"%(key)s\", \"value\":\"%(data)s\"}]}\' " +
                    "\"http://%(ip)s:8082/topics/%(topic)s\"")

consume_id_template = ("curl -s -X POST -H \"Content-Type: application/vnd.kafka.v1+json\" " +
                       "--data \'{\"name\": \"%(consumer_name)s\", \"format\": \"binary\", " +
                       "\"auto.offset.reset\": \"smallest\"}\' " +
                       "http://%(ip)s:8082/consumers/my_binary_consumer")

consume_template = ("curl -s -X GET -H \"Accept: application/vnd.kafka.binary.v1+json\" " +
                    "http://%(ip)s:8082/consumers/my_binary_consumer/instances/%(topic)s-consumer/topics/%(topic)s")

get_by_offset_template = ("curl -s \"http://%(ip)s:8082/topics/%(topic)s/partitions/%(partition)s/messages?offset=%(offset)s\"")


class KafkaRestAPIWrapper(object):
    def __init__(self, ip):
        self.env_dict = {"ip": ip}
        self.topic_consumer_dict = {}

    # def id_uri_from_json(self, json_dict):
    #     self.consumer_id_dict[json_dict["instance_id"]] = json_dict

    def register_consumer_id(self, topic):
        mame = self.env_dict.copy()
        mame["consumer_name"] = topic + "-consumer"
        # print(consume_id_template % mame)
        run_result = getstatusoutput(consume_id_template % mame)

        return json.loads(run_result[1])

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
        # print(produce_template % mame)
        run_result = getstatusoutput(produce_template % mame)
        return run_result[1]

    def consume(self, topic):
        mame = self.env_dict.copy()
        mame["topic"] = topic
        consumer_dict = self.topic_consumer_dict.get(topic)
        if not(consumer_dict):
            self.register_consumer_id(topic)

        # print(consume_template % mame)
        run_result = getstatusoutput(consume_template % mame)
        return run_result[1]


def ascii_to_int(ascii_string):
    length = len(ascii_string)
    base = 256
    result = 0
    for ii in range(length):
        result += ord(ascii_string[ii]) * (base ** (length - 1 - ii))
    return result


def print_record(record):
    print("%s: %s" % (base64.b64decode(record[u"key"]),
                      ascii_to_int(base64.b64decode(record[u"value"]))))

if __name__ == '__main__':
    client = KafkaRestAPIWrapper("192.168.20.183")
    h1 = client.consume("access-log")
    h2 = client.consume("track-log")
    h3 = client.consume("count-log")

    print(len(h1))
    print(len(h2))
    print(len(h3))
