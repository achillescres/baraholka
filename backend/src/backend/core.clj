(ns backend.core
  (:require
   [ring.adapter.jetty :refer [run-jetty]]
   [reitit.ring :as ring]
   [ring.middleware.params :refer [wrap-params]]
   [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
   [cheshire.generate :as cheshire-gen]
   [backend.dao.sqlite :as db]))

;; поддержка BigDecimal в JSON
(cheshire-gen/add-encoder java.math.BigDecimal cheshire-gen/encode-str)

(defn json-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/json"}
   :body data})

;; Handlers

(defn register-user [{{:keys [name email]} :body}]
  (try
    (let [user (db/create-user {:name name :email email})]
      (json-response user 201))
    (catch Exception e
      (json-response {:error "Пользователь с таким email уже существует"} 400))))

(defn create-ad [{{:keys [user_id title description price]} :body}]
  (let [ad (db/create-ad {:user_id user_id :title title :description description :price price})]
    (json-response ad 201)))

(defn list-ads [_]
  (json-response (db/list-ads)))

(defn purchase-ad [{{:keys [buyer_id ad_id]} :body}]
  (let [result (db/purchase-ad buyer_id ad_id)]
    (if (:error result)
      (json-response result 400)
      (json-response result 200))))

(defn list-user-purchases [{:keys [path-params]}]
  (let [user-id (Integer/parseInt (:id path-params))]
    (json-response (db/list-user-purchases user-id))))

;; Router

(def app
  (-> (ring/ring-handler
       (ring/router
        [["/users"
          {:post register-user}]
         ["/users/:id/purchases"
          {:get list-user-purchases}]
         ["/ads"
          {:get list-ads
           :post create-ad}]
         ["/purchase"
          {:post purchase-ad}]])
       (ring/create-default-handler))
      wrap-params
      (wrap-json-body {:keywords? true})
      wrap-json-response))

;; App Entry Point

(defn -main []
  (println "Запуск на http://localhost:3000")
  (db/init-db)
  (run-jetty app {:port 3000}))
