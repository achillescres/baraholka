(ns backend.core-test
  (:require [clojure.test :refer :all]
            [backend.core :as core]
            [com.stuartsierra.component :as component]
            [next.jdbc :as jdbc]
            [next.jdbc.sql :as sql]))

(def ^:dynamic *test-system* nil)

(defn with-system
  [test-fn]
  (binding [*test-system* (-> (core/read-config)
                              (core/build-system)
                              (component/start-system))]
    (try
      (test-fn)
      (finally
        (component/stop-system *test-system*)))))

(use-fixtures :each with-system)

(deftest test-insert-user
  (let [db (:db *test-system*)]
    (println "LOLLLLLLL: " (db))
    (sql/insert! (db)
                 :users {:id 1 :name "Andrey"})
    (is (= {:id 1
            :name "Andrey"}
           (sql/get-by-id (db) :users 1
                          jdbc/unqualified-snake-kebab-opts)))))

(comment
  (with-system test-insert-user)
  (with-system (fn [] (println ( (:db *test-system*))))))
