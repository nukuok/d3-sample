package demo.streams;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KGroupedStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.KStreamBuilder;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.kstream.Windowed;

import java.util.Arrays;
import java.util.Properties;

public class testConcate {

  public static void main(String[] args) throws Exception {
    Properties streamsConfiguration = new Properties();
    streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, "blog-demo");
    streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    streamsConfiguration.put(StreamsConfig.ZOOKEEPER_CONNECT_CONFIG, "localhost:2181");
    streamsConfiguration.put(StreamsConfig.KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
    streamsConfiguration.put(StreamsConfig.VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

    final Serde<String> stringSerde = Serdes.String();
    // final Serde<Windowed<String>> windowedStringSerde = new WindowedSerde<>(stringSerde);
    // final Serde<Long> longSerde = Serdes.Long();

    KStreamBuilder builder = new KStreamBuilder();

    KStream<String, String> states = builder.stream(stringSerde, stringSerde, "access-log");

    // Pattern pattern = Pattern.compile("\\W+", Pattern.UNICODE_CHARACTER_CLASS);

    // KTable<Windowed<String>, String> mame = states
    KTable<String, String> mame = states
	.groupByKey()
	.aggregate(
		   () -> "",
		   (aggKey, value, aggregate) -> aggregate.concat(value),
		   // TimeWindows.of(5000L).advanceBy(1000L),
		   stringSerde,
		   "track-log"
		   );
        // .toStream();

    mame.to(stringSerde, stringSerde, "track-log");

    KafkaStreams streams = new KafkaStreams(builder, streamsConfiguration);
    streams.start();

    Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
  }

}
