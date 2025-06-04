(defproject backend "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [ring/ring-core "1.11.0"]
                 [ring/ring-json "0.5.1"]
                 [ring/ring-jetty-adapter "1.11.0"]
                 [metosin/reitit "0.8.0"]
                 [metosin/malli "0.16.0"]
                 [datalevin "0.9.22"]
                 [buddy/buddy-hashers "1.8.158"]
                 [buddy/buddy-sign "3.4.1"]
                 [aero/aero "1.1.6"]
                 ;; sqlite
                 [com.stuartsierra/component "1.1.0"]
                 [org.xerial/sqlite-jdbc "3.46.1.3"]
                 [com.github.seancorfield/next.jdbc "1.3.955"]
                 [com.zaxxer/HikariCP "6.0.0"]
                 [org.flywaydb/flyway-core "10.19.0"]
                 [org.clojure/tools.logging "1.3.0"]
                 [org.slf4j/slf4j-simple "2.1.0-alpha1"]]
  :main ^:skip-aot backend.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}
             :test {:dependencies [[org.clojure/test.check "1.1.1"]
                                 [criterium "0.4.6"]]
                   :plugins [[lein-cloverage "1.2.4"]]}
             :dev {:dependencies [[pjstadig/humane-test-output "0.11.0"]]
                  :injections [(require 'pjstadig.humane-test-output)
                              (pjstadig.humane-test-output/activate!)]}}
  :aliases {"test" ["with-profile" "+test" "test"]
            "build" ["with-profile" "+uberjar" "uberjar"]})