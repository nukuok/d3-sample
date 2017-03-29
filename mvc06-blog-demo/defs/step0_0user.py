import numpy as np


class Users(object):
    def __init__(self):
        self.user_num = 20
        self.state_num = 10

    def normalize_matrix(self, matrix):
        matrix *= self.mask
        row_sum = np.sum(matrix, axis=1)
        to_divide = np.tile(row_sum.reshape(self.state_num, 1), (1, self.state_num))
        matrix /= to_divide
        # matrix = np.cumsum(matrix, axis=1)
        return matrix

    def set_users_matrix(self):
        self.user_matrix = np.random.rand(self.user_num, self.state_num, self.state_num)
        self.mask = np.ones((self.state_num, self.state_num)) - np.eye(self.state_num)
        for ii in range(self.user_num):
            self.user_matrix[ii, :, :] = self.normalize_matrix(self.user_matrix[ii, :, :])

    def reset_ith_matrix(self, i):
        matrix = np.random.rand(self.state_num, self.state_num) * self.mask
        self.user_matrix[i, :, :] = self.normalize_matrix(matrix)


class RecordGenerator(Users):
    def __init__(self):
        super(RecordGenerator, self).__init__()
        self.set_users_matrix()
        self.page_num = 2
        self.page_state_num = self.state_num
        self.page_transfer_num = int(self.page_state_num * 0.4)
        self.max_step = 40

    def set_users_current_state(self):
        self.current_state = np.zeros(self.user_num)
        self.current_step = np.zeros(self.user_num)
        self.current_page = np.random.permutation(self.user_num) % self.page_num

    def user_exit_prob(self, current_step, max_step):
        return float(current_step) / max_step

    def reset_ith_state_and_step(self, i):
        self.current_step[i] = 0
        self.current_state[i] = 0

    def set_pages_matrix(self):
        self.page_matrix = np.zeros((self.page_num, self.page_state_num, self.page_state_num))
        for ii in range(self.page_num):
            for jj in range(self.page_state_num):
                transfer = (np.random.permutation(self.page_state_num - 1) < self.page_transfer_num) * 1
                self.page_matrix[ii, jj, :] = np.insert(transfer, jj, 0)

    def gen_record_and_update(self):
        self.current_step += 1
        records = np.zeros(self.user_num)
        for ii in range(self.user_num):
            user_prob = self.user_matrix[ii, int(self.current_state[ii]), :]
            page_prob = self.page_matrix[int(self.current_page[ii]), int(self.current_state[ii]), :]
            total_prob = user_prob * page_prob
            destiny_prob = np.cumsum(total_prob) / np.sum(total_prob)
            self.current_state[ii] = np.sum((destiny_prob < np.random.rand()) * 1)
            records[ii] = self.current_state[ii]
        return records

    def check_exited_user_and_update(self):
        for ii in range(self.user_num):
            exit_prob = self.user_exit_prob(self.current_step[ii], self.max_step)
            if np.random.rand() < exit_prob:
                self.reset_ith_matrix(ii)
                self.reset_ith_state_and_step(ii)

    def format_record(self, records):
        return ["u%03d\tp%02d\ts%04d" % (ii, self.current_page[ii], records[ii]) for ii in range(len(records))]

if __name__ == '__main__':
    # users_data = Users()
    # users_data.set_users_matrix()
    # users_data.set_users_current_state()
    rg = RecordGenerator()
    rg.set_pages_matrix()
    rg.set_users_current_state()
    for ii in range(30):
        records = rg.gen_record_and_update()
        rg.check_exited_user_and_update()
        print(rg.format_record(records)[0])
