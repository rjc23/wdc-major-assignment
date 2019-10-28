
Prac 3

SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition
ORDER BY column_name(s);

Task 1

SELECT jobtype, count (*) AS 'Number of Book Jobs'
FROM bookjobs 
GROUP BY jobtype
HAVING count (*) >= 3;


Task 2

SELECT vendor_id, count (*) AS 'Number of Purchase Orders'
FROM pos
WHERE po_date >= '1990-01-01'  
GROUP BY vendor_id
HAVING count (*) > 1
	AND job_id != '006';
	
Task 3

SELECT job_id, max(quantity) - avg(quantity) AS 'Difference'
FROM po_items
WHERE item_id != 'IWS'
GROUP BY job_id
HAVING job_id != '006'
ORDER BY job_id DESC;



Task 4

SELECT item_id, max(quantity) - min(quantity) AS 'Quantity Difference'
FROM po_items
GROUP BY item_id
HAVING (max(quantity) - min(quantity)) > 50;


Task 5

SELECT po_id, sum(quantity) AS 'Total Quantity'
FROM po_items
GROUP BY po_id
HAVING sum(quantity) > 50
	AND po_id != 'AAA'
	AND po_id != 'GGG';


