from step0_0user import RecordGenerator
from utils import RepeatedTimer
from kafka_utils2 import KafkaRestAPIWrapper
from kafka_utils2 import ascii_to_int


if __name__ == '__main__':
    rg = RecordGenerator()
    rg.set_pages_matrix()
    rg.set_users_current_state()

    client = KafkaRestAPIWrapper("192.168.20.183")

    def gen_record_and_produce():
        records = rg.gen_record_and_update()
        rg.check_exited_user_and_update()
        for (ii, record) in enumerate(records):
            client.produce("access-log", "u%03d" % ii, "s%03d" % record)

    produce_job = RepeatedTimer(5, gen_record_and_produce)
    produce_job.start()

