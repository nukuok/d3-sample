package demo.streams;

import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.KStreamBuilder;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.kstream.Windowed;

import java.util.Arrays;
import java.util.Properties;
// import java.util.regex.Pattern;

public class BlogDemoStep4 {
  public static void main(String[] args) throws Exception {
    Properties streamsConfiguration = new Properties();
    streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, "blog-demo");
    streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    streamsConfiguration.put(StreamsConfig.ZOOKEEPER_CONNECT_CONFIG, "localhost:2181");
    streamsConfiguration.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 0);
    streamsConfiguration.put(StreamsConfig.KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
    streamsConfiguration.put(StreamsConfig.VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());

    final Serde<String> stringSerde = Serdes.String();
    final Serde<Long> longSerde = Serdes.Long();

    KStreamBuilder builder = new KStreamBuilder();

    KStream<String, String> states = builder.stream(stringSerde, stringSerde, "access-log");

    // Pattern pattern = Pattern.compile("\\W+", Pattern.UNICODE_CHARACTER_CLASS);

    // KTable<Windowed<String>, String> mame = states
    KStream<String, String> mame = states
	.groupByKey()
	.aggregate(
		   () -> "",
		   (aggKey, value, aggregate) -> {
		       if (aggregate.length() >= 8){
		       	   return aggregate.substring(4,8).concat(value);
		       } else {
		       	   return aggregate.concat(value);
		       }
		   },
		   // TimeWindows.of(5000L).advanceBy(1000L),
		   stringSerde,
		   "track-log"
		   )
        .toStream();

    mame.to(stringSerde, stringSerde, "track-log");

    // KTable<Windowed<String>, Long> trackCounts = mame
    KStream<String, Long> trackCounts = mame
      // .flatMapValues(value -> value)
	.groupBy((key, word) -> word)
	// .count(TimeWindows.of(300000L).advanceBy(60000L),"Counts")
	.count(TimeWindows.of(600000L),"Counts")
	.toStream()
	// .map((key, value) -> new KeyValue<>(key.key() + "-" + key.window().start() + "-" + key.window().end(), value));
	.map((key, value) -> new KeyValue<>(key.window().start() + "-" + key.key(), value));

    trackCounts.to(stringSerde, longSerde, "count-log");

    KafkaStreams streams = new KafkaStreams(builder, streamsConfiguration);
    streams.start();

    Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
  }

}
