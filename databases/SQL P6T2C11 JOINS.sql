

Questions 1 

SELECT b.cust_id, name, creditcode, sum(quantity * price) AS 'Total'
FROM po_items poi, items it, bookjobs b, publishers p, pos
WHERE poi.item_id = it.item_id
AND poi.job_id = pos.job_id AND poi.po_id = pos.po_id
AND pos.job_id = b.job_id
AND b.cust_id = p.cust_id
GROUP BY b.cust_id, name, creditcode
HAVING sum(quantity * price) > 2000;

Question 2

SELECT p.name, p.city, p.creditcode, po.quantity
FROM publishers p
JOIN bookjobs b
JOIN pos p 
JOIN po_items po 
ON p.cust_id = b.cust_id
	AND b.job_id = p.job_id 
	AND p.po_id = po.po_id
WHERE quantity > 
	(SELECT AVG(quantity)
	FROM po_items)
ORDER BY quantity;


Question 3

SELECT DISTINCT p.cust_id, p.name
FROM publishers p
JOIN bookjobs b
JOIN pos p 
ON p.cust_id = b.cust_id
	AND b.job_id = p.job_id 
WHERE p.cust_id = b.cust_id 
	AND b.job_id = p.job_id;