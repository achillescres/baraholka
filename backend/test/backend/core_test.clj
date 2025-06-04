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
    (sql/insert! (db)
                 :users {:id 1 :name "Andrey" :email "andrey@test.com"})
    (is (= {:id 1
            :name "Andrey"
            :email "andrey@test.com"}
           (sql/get-by-id (db) :users 1
                          jdbc/unqualified-snake-kebab-opts)))))

(deftest test-create-ad
  (let [db (:db *test-system*)]
    ;; Сначала создаем пользователя
    (sql/insert! (db)
                 :users {:id 1 :name "Andrey" :email "andrey@test.com"})
    ;; Создаем объявление
    (sql/insert! (db)
                 :ads {:id 1 
                      :user_id 1
                      :title "Test Ad"
                      :description "Test Description"
                      :price 100.0})
    ;; Проверяем созданное объявление
    (is (= {:id 1
            :user_id 1
            :title "Test Ad"
            :description "Test Description"
            :price 100.0}
           (sql/get-by-id (db) :ads 1
                          jdbc/unqualified-snake-kebab-opts)))))

(deftest test-purchase-ad
  (let [db (:db *test-system*)]
    ;; Создаем продавца
    (sql/insert! (db)
                 :users {:id 1 :name "Seller" :email "seller@test.com"})
    ;; Создаем покупателя
    (sql/insert! (db)
                 :users {:id 2 :name "Buyer" :email "buyer@test.com"})
    ;; Создаем объявление
    (sql/insert! (db)
                 :ads {:id 1 
                      :user_id 1
                      :title "Test Ad"
                      :description "Test Description"
                      :price 100.0})
    ;; Выполняем покупку
    (sql/insert! (db)
                 :purchases {:id 1
                           :ad_id 1
                           :buyer_id 2})
    ;; Проверяем запись о покупке
    (is (= {:id 1
            :ad_id 1
            :buyer_id 2}
           (sql/get-by-id (db) :purchases 1
                          jdbc/unqualified-snake-kebab-opts)))))

(deftest test-list-user-purchases
  (let [db (:db *test-system*)]
    ;; Создаем продавца
    (sql/insert! (db)
                 :users {:id 1 :name "Seller" :email "seller@test.com"})
    ;; Создаем покупателя
    (sql/insert! (db)
                 :users {:id 2 :name "Buyer" :email "buyer@test.com"})
    ;; Создаем два объявления
    (sql/insert! (db)
                 :ads {:id 1 
                      :user_id 1
                      :title "Test Ad 1"
                      :description "Test Description 1"
                      :price 100.0})
    (sql/insert! (db)
                 :ads {:id 2 
                      :user_id 1
                      :title "Test Ad 2"
                      :description "Test Description 2"
                      :price 200.0})
    ;; Создаем две покупки
    (sql/insert! (db)
                 :purchases {:id 1
                           :ad_id 1
                           :buyer_id 2})
    (sql/insert! (db)
                 :purchases {:id 2
                           :ad_id 2
                           :buyer_id 2})
    ;; Проверяем список покупок пользователя
    (let [purchases (sql/query (db)
                              ["SELECT p.*, a.title, a.description, a.price 
                                FROM purchases p 
                                JOIN ads a ON p.ad_id = a.id 
                                WHERE p.buyer_id = ?" 2]
                              jdbc/unqualified-snake-kebab-opts)]
      (is (= 2 (count purchases)))
      (is (= "Test Ad 1" (:title (first purchases))))
      (is (= "Test Ad 2" (:title (second purchases)))))))

(deftest test-list-ads
  (let [db (:db *test-system*)]
    ;; Создаем пользователя
    (sql/insert! (db)
                 :users {:id 1 :name "Seller" :email "seller@test.com"})
    ;; Создаем два объявления
    (sql/insert! (db)
                 :ads {:id 1 
                      :user_id 1
                      :title "Test Ad 1"
                      :description "Test Description 1"
                      :price 100.0})
    (sql/insert! (db)
                 :ads {:id 2 
                      :user_id 1
                      :title "Test Ad 2"
                      :description "Test Description 2"
                      :price 200.0})
    ;; Проверяем список объявлений
    (let [ads (sql/query (db)
                         ["SELECT * FROM ads"]
                         jdbc/unqualified-snake-kebab-opts)]
      (is (= 2 (count ads)))
      (is (= "Test Ad 1" (:title (first ads))))
      (is (= "Test Ad 2" (:title (second ads)))))))

(comment
  (with-system test-insert-user)
  (with-system test-create-ad)
  (with-system test-purchase-ad)
  (with-system test-list-user-purchases)
  (with-system test-list-ads))
