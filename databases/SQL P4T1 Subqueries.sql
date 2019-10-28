
Prac 4 Task 1

SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition
ORDER BY column_name(s);

Task 1

select name, phone
from publishers 
where cust_id IN 
        (select cust_id
         from bookjobs
         where jobtype = 'R');

Task 2

SELECT item_id, descr, on_hand, price
FROM items
WHERE price < 
				(select avg(price)
			   FROM items);
		
		

	
Task 3

SELECT job_id, po_id, po_date, vendor_id
FROM pos s1
WHERE po_date <= 
				(select min(po_date)
				 FROM pos s2
				 WHERE s1.vendor_id = s2.vendor_id)
ORDER BY vendor_id;




