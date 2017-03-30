import os
# import re
from step1_1backend import BlogDemoBackend


class Application(object):
    def __init__(self):
        self.bdb = BlogDemoBackend()
        self.bdb.client_update_count_records()

    def __call__(self, env, start_response):
        if env['PATH_INFO'] == "/":
            # index_contents = Path('html/index.html').read_text().encode()
            script_path = os.path.dirname(os.path.realpath(__file__))
            with open(os.path.join(script_path, 'html/index.html'), 'r') as fid:
                index_contents = fid.read()
                length = str(len(index_contents))

                start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                          ('HTTP-Version', 'HTTP/1.1'),
                                          ('Content-Type', 'text/html'),
                                          ('Content-Length', length)])
                return [index_contents]

        elif env['PATH_INFO'].startswith("/records"):
            res_body = str([int(num) for num in self.bdb.records.tolist()])

            print(res_body)
            start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                      ('Content-Type', 'application/json'),
                                      ('Content-Length', str(len(res_body)))])
            return [res_body]

        elif env['PATH_INFO'].startswith("/counts"):
            counts = self.bdb.count_records
            sn = self.bdb.rg.state_num
            arranged_counts = [[counts[jj * sn + ii] for jj in range(sn)] for ii in range(sn)]

            res_body = str(arranged_counts)  # .replace("'", '"').encode()

            start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                      ('Content-Length', str(len(res_body)))])
            return [res_body]

        elif env['PATH_INFO'] == "/favicon.ico":
            start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                      ('Content-Length', '1')])
            return [b' ']
        else:
            if env['PATH_INFO'].endswith("js"):
                script_path = os.path.dirname(os.path.realpath(__file__))
                js_path = os.path.join(script_path, "html", env['PATH_INFO'].lstrip('/'))
                with open(js_path, 'r') as fid:
                    js_contents = fid.read()

                length = str(len(js_contents.encode()))

                start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                          ('Content-Type', 'text/javascript'),
                                          ('Content-Length', length)])
                return [js_contents]
            elif env['PATH_INFO'].endswith("css"):
                script_path = os.path.dirname(os.path.realpath(__file__))
                css_path = os.path.join(script_path, "html", env['PATH_INFO'].lstrip('/'))
                with open(css_path, 'r') as fid:
                    css_contents = fid.read()

                length = str(len(css_contents.encode()))

                start_response("200 OK", [('Access-Control-Allow-Origin', 'null'),
                                          ('Content-Type', 'text/css'),
                                          ('Content-Length', length)])
                return [css_contents]
            else:
                assert False


if __name__ == '__main__':
    from wsgiref.simple_server import make_server

    application = Application()

    try:
        application.bdb.job_start()
        port = 8888
        server = make_server('localhost', port, application)
        print("Serving on port %d" % port)
        server.serve_forever()
    finally:
        application.bdb.job_stop()
