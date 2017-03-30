import json
import base64

from step0_0user import RecordGenerator
from utils import RepeatedTimer
from kafka_utils2 import KafkaRestAPIWrapper
from kafka_utils2 import ascii_to_int


class BlogDemoBackend(object):
    def __init__(self):
        self.rg = RecordGenerator()
        self.rg.set_pages_matrix()
        self.rg.set_users_current_state()

        self.kafka_client = KafkaRestAPIWrapper("localhost")

        self.records = []
        self.track_records = []
        self.timestamp = ""
        self.count_records = [0] * (self.rg.state_num ** 2)

    def gen_record_and_produce(self):
        self.records = self.rg.gen_record_and_update()
        self.rg.check_exited_user_and_update()
        for (ii, record) in enumerate(self.records):
            self.kafka_client.produce("access-log", "u%03d" % ii, "s%03d" % record)

    def client_update_track_records(self):
        track_log = json.loads(self.kafka_client.consume("track-log"))
        self.track_records = [[base64.b64decode(record["key"]),
                               base64.b64decode(record["value"])] for record in track_log]

    def client_update_count_records(self):
        count_log = json.loads(self.kafka_client.consume("count-log"))
        for record in count_log:
            key = base64.b64decode(record["key"])
            value = ascii_to_int(base64.b64decode(record["value"]))
            (timestamp, track) = key.split("-")
            if timestamp != self.timestamp:
                self.timestamp = timestamp
                self.count_records = [0] * (self.rg.state_num ** 2)
            index = int(track[3]) * self.rg.state_num + int(track[7])
            self.count_records[index] = value

    def reset_record_generator(self):
        self.rg.set_pages_matrix()
        self.rg.set_users_current_state()

    def job_start(self):
        self.produce_job = RepeatedTimer(5, self.gen_record_and_produce)
        self.produce_job.start()
        self.update_job = RepeatedTimer(5, self.client_update_count_records)
        self.update_job.start()
        self.reset_job = RepeatedTimer(3600, self.reset_record_generator)
        self.reset_job.start()

    def job_stop(self):
        self.produce_job.stop()
        self.update_job.stop()
        self.reset_job.stop()

if __name__ == '__main__':
    bdb = BlogDemoBackend()
    bdb.job_start()
